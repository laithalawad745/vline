import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// API لاستقبال الصور والفيديوهات المعدلة يدوياً من موقع الأدمن
export async function POST(request: Request) {
  try {
    // التحقق من السر المشترك
    const webhookSecret = request.headers.get('X-Webhook-Secret');
    if (webhookSecret !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, manualImageUrl, manualVideoUrl } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    console.log('📥 Received manual media for product:', productId);

    // حفظ الروابط في جدول processed_images كمودل إضافي
    // نستخدم model_id خاص للمودلات اليدوية
    const { data, error } = await supabase
      .from('processed_images')
      .insert([
        {
          product_id: productId,
          model_id: 'manual_edit', // معرّف خاص للمودلات اليدوية
          processed_image_url: manualImageUrl,
          video_url: manualVideoUrl, // نضيف حقل جديد للفيديو
        },
      ])
      .select()
      .single();

    if (error) {
      // إذا كان السجل موجود، نحدّثه
      if (error.code === '23505') {
        const { data: updatedData, error: updateError } = await supabase
          .from('processed_images')
          .update({
            processed_image_url: manualImageUrl,
            video_url: manualVideoUrl,
          })
          .eq('product_id', productId)
          .eq('model_id', 'manual_edit')
          .select()
          .single();

        if (updateError) throw updateError;

        console.log('✅ Manual media updated successfully');
        return NextResponse.json(updatedData);
      }
      throw error;
    }

    console.log('✅ Manual media saved successfully');
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error receiving manual media:', error);
    return NextResponse.json(
      { 
        error: 'Failed to save manual media',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}