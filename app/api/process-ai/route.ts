import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// تعريف حسابات Hugging Face الثلاثة
const HF_ACCOUNTS = [
  process.env.HUGGING_FACE_API_KEY_1,
  process.env.HUGGING_FACE_API_KEY_2,
  process.env.HUGGING_FACE_API_KEY_3,
].filter(Boolean);

// متغير لتتبع الحساب الحالي
let currentAccountIndex = 0;

// دالة للحصول على الحساب التالي
function getNextAccount(): { apiKey: string | undefined; accountNumber: number } {
  if (HF_ACCOUNTS.length === 0) {
    console.warn('⚠️ Warning: No Hugging Face API keys found. Using free tier.');
    return { apiKey: undefined, accountNumber: 0 };
  }

  const accountNumber = currentAccountIndex + 1;
  const apiKey = HF_ACCOUNTS[currentAccountIndex];
  
  currentAccountIndex = (currentAccountIndex + 1) % HF_ACCOUNTS.length;
  
  return { apiKey, accountNumber };
}

// Helper: تحويل URL إلى Blob
async function urlToBlob(url: string): Promise<Blob> {
  const response = await fetch(url);
  return await response.blob();
}

// Helper: حفظ Blob في Supabase Storage
async function uploadBlob(blob: Blob, filename: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from('processed')
      .upload(filename, blob, {
        contentType: blob.type,
      });

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('processed')
      .getPublicUrl(filename);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading blob:', error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { productId, productImageUrl, modelId, modelImageUrl } = await request.json();

    console.log('🚀 Processing started:', { productId, modelId });

    const { apiKey, accountNumber } = getNextAccount();

    if (!apiKey) {
      console.log('⚠️ No API key available, using free tier with rate limits.');
    } else {
      console.log(`✅ Using Hugging Face Account ${accountNumber}`);
    }

    // 1. تحويل الصور إلى Blobs
    console.log('📥 Converting images to blobs...');
    const productBlob = await urlToBlob(productImageUrl);
    const modelBlob = await urlToBlob(modelImageUrl);

    // 2. الاتصال بـ Hugging Face API
    console.log(`🔗 Connecting to Hugging Face using Account ${accountNumber}...`);
    
    // استيراد dynamically
    const { Client } = await import('@gradio/client');
    
    const client = await Client.connect('yisol/IDM-VTON', {
      hf_token: apiKey as `hf_${string}` | undefined,
    });

    console.log('🎨 Processing AI image...');
    const result = await client.predict('/tryon', {
      dict: { background: modelBlob, layers: [], composite: null },
      garm_img: productBlob,
      garment_des: 'clothing',
      is_checked: true,
      is_checked_crop: false,
      denoise_steps: 30,
      seed: 42,
    });

    // 3. حفظ النتيجة
    const resultUrl = (result.data as any)[0]?.url;
    if (!resultUrl) {
      throw new Error('No result from AI processing');
    }

    console.log('💾 Uploading processed image to Supabase...');
    const resultBlob = await urlToBlob(resultUrl);
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
    const processedImageUrl = await uploadBlob(resultBlob, filename);

    if (!processedImageUrl) {
      throw new Error('Failed to upload processed image');
    }

    // 5. حفظ في قاعدة البيانات
    console.log('💿 Saving to database...');
    const { data, error } = await supabase
      .from('processed_images')
      .upsert(
        {
          product_id: productId,
          model_id: modelId,
          processed_image_url: processedImageUrl,
        },
        {
          onConflict: 'product_id,model_id',
        }
      )
      .select()
      .single();

    if (error) throw error;

    console.log('✅ Processing completed successfully using Account', accountNumber);
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error processing AI:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process AI',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}