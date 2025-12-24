import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Client } from '@gradio/client';

// إعدادات Runtime
export const runtime = 'nodejs';

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
    console.warn('⚠️ Warning: No Hugging Face API keys found');
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
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
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
      console.error('❌ Upload error:', error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('processed')
      .getPublicUrl(filename);

    return urlData.publicUrl;
  } catch (error) {
    console.error('❌ Error uploading blob:', error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { productId, productImageUrl, modelId, modelImageUrl } = await request.json();

    console.log('🚀 Processing started:', { productId, modelId });

    // الحصول على API Key
    const { apiKey, accountNumber } = getNextAccount();

    if (!apiKey) {
      throw new Error('No Hugging Face API key available. Please add HUGGING_FACE_API_KEY_1 to environment variables.');
    }

    console.log(`✅ Using Hugging Face Account ${accountNumber}`);

    // 1. تحويل الصور إلى Blobs
    console.log('📥 Converting product image to blob...');
    const productBlob = await urlToBlob(productImageUrl);
    console.log('✅ Product image converted');

    console.log('📥 Converting model image to blob...');
    const modelBlob = await urlToBlob(modelImageUrl);
    console.log('✅ Model image converted');

    // 2. الاتصال بـ Hugging Face API
    console.log(`🔌 Connecting to Hugging Face (Account ${accountNumber})...`);
    
    const client = await Client.connect('yisol/IDM-VTON', {
      hf_token: apiKey as `hf_${string}`,
    });

    console.log('✅ Connected to Hugging Face successfully');

    // 3. معالجة الصورة
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

    console.log('✅ AI processing completed');

    // 4. التحقق من النتيجة
    const resultUrl = (result.data as any)[0]?.url;
    if (!resultUrl) {
      throw new Error('No result URL from AI processing');
    }

    console.log('📥 Downloading processed image from Hugging Face...');
    const resultBlob = await urlToBlob(resultUrl);
    console.log('✅ Processed image downloaded');

    // 5. رفع الصورة المعالجة إلى Supabase
    console.log('💾 Uploading processed image to Supabase...');
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
    const processedImageUrl = await uploadBlob(resultBlob, filename);

    if (!processedImageUrl) {
      throw new Error('Failed to upload processed image to Supabase');
    }

    console.log('✅ Processed image uploaded to Supabase');

    // 6. حفظ في قاعدة البيانات
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

    if (error) {
      console.error('❌ Database error:', error);
      throw error;
    }

    console.log('✅ Processing completed successfully');
    console.log('📊 Result:', data);

    return NextResponse.json({
      success: true,
      data,
      account: accountNumber,
    });

  } catch (error) {
    console.error('❌ ========== FULL ERROR DETAILS ==========');
    console.error('❌ Error:', error);
    console.error('❌ Error Message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('❌ Error Stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('❌ ==========================================');
    
    return NextResponse.json(
      { 
        error: 'Failed to process AI',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
      },
      { status: 500 }
    );
  }
}