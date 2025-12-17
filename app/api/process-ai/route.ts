import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Client } from '@gradio/client';

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

    console.log('Processing:', { productId, modelId });

    // التحقق من وجود API Key
    const apiKey = process.env.HUGGING_FACE_API_KEY;
    if (!apiKey) {
      console.warn('⚠️ Warning: No Hugging Face API key found. Using free tier with rate limits.');
    }

    // 1. تحويل الصور إلى Blobs
    const productBlob = await urlToBlob(productImageUrl);
    const modelBlob = await urlToBlob(modelImageUrl);

    // 2. الاتصال بـ Hugging Face API مع API Key
    const client = await Client.connect('yisol/IDM-VTON', {
      hf_token: apiKey || undefined, // إضافة API Key هنا
    });

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
    const resultUrl = result.data[0]?.url;
    if (!resultUrl) {
      throw new Error('No result from AI processing');
    }

    // 4. تحميل الصورة المعالجة وحفظها في Supabase
    const resultBlob = await urlToBlob(resultUrl);
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
    const processedImageUrl = await uploadBlob(resultBlob, filename);

    if (!processedImageUrl) {
      throw new Error('Failed to upload processed image');
    }

    // 5. حفظ في قاعدة البيانات
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

    console.log('✅ Processing completed successfully');
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