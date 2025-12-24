import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import Replicate from 'replicate';

export const runtime = 'nodejs';

// Helper: تحويل URL إلى Base64
async function urlToBase64(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  const blob = await response.blob();
  const buffer = await blob.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  const mimeType = blob.type || 'image/jpeg';
  return `data:${mimeType};base64,${base64}`;
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

    // التحقق من وجود Replicate API Token
    const replicateToken = process.env.REPLICATE_API_TOKEN;
    if (!replicateToken) {
      throw new Error('REPLICATE_API_TOKEN is not configured');
    }

    console.log('✅ Replicate API Token found');

    // إنشاء Replicate Client
    const replicate = new Replicate({
      auth: replicateToken,
    });

    console.log('📥 Converting images to base64...');
    const productBase64 = await urlToBase64(productImageUrl);
    const modelBase64 = await urlToBase64(modelImageUrl);
    console.log('✅ Images converted to base64');

    // استدعاء Replicate API
    console.log('🎨 Processing with Replicate IDM-VTON...');
    
    const output: any = await replicate.run(
      "cuuupid/idm-vton:c871bb9b046607b680449ecbae55fd8c6d945e0a1948644bf2361b3d021d3ff4",
      {
        input: {
          garm_img: productBase64,
          human_img: modelBase64,
          garment_des: "clothing",
          is_checked: true,
          is_checked_crop: false,
          denoise_steps: 30,
          seed: 42,
        }
      }
    );

    console.log('✅ Replicate processing completed');

    // التحقق من النتيجة
    const resultUrl = typeof output === 'string' ? output : output?.[0];
    
    if (!resultUrl || typeof resultUrl !== 'string') {
      console.error('❌ Invalid output format:', output);
      throw new Error('No valid output URL from Replicate');
    }

    // تحميل الصورة المعالجة
    console.log('📥 Downloading processed image from:', resultUrl);
    const response = await fetch(resultUrl);
    const resultBlob = await response.blob();
    console.log('✅ Processed image downloaded');

    // رفع الصورة إلى Supabase
    console.log('💾 Uploading to Supabase...');
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
    const processedImageUrl = await uploadBlob(resultBlob, filename);

    if (!processedImageUrl) {
      throw new Error('Failed to upload processed image');
    }

    console.log('✅ Image uploaded to Supabase');

    // حفظ في قاعدة البيانات
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

    return NextResponse.json({
      success: true,
      data,
    });

  } catch (error) {
    console.error('❌ ========== ERROR ==========');
    console.error('❌ Error:', error);
    console.error('❌ Message:', error instanceof Error ? error.message : 'Unknown');
    console.error('❌ Stack:', error instanceof Error ? error.stack : 'No stack');
    console.error('❌ ============================');
    
    return NextResponse.json(
      { 
        error: 'Failed to process AI',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
