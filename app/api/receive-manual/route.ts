import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// API لاستقبال الصور والفيديوهات المعدلة يدوياً من موقع CenterStore
export async function POST(request: Request) {
  try {
    // 1. التحقق من السر المشترك
    const webhookSecret = request.headers.get('X-Webhook-Secret');
    if (webhookSecret !== process.env.WEBHOOK_SECRET) {
      console.error('❌ Unauthorized: Invalid webhook secret');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. قراءة البيانات
    const body = await request.json();
    const { productId, manualImageUrl, manualVideoUrl } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    console.log('📥 Received manual media for product:', productId);
    console.log('🖼️ Image:', manualImageUrl ? 'Yes' : 'No');
    console.log('🎥 Video:', manualVideoUrl ? 'Yes' : 'No');

    // 3. التحقق من وجود المنتج
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, name')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      console.error('❌ Product not found:', productId);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // 4. حفظ الروابط في جدول processed_images
    // نستخدم model_id = NULL للمحتوى اليدوي
    const { data: existingRecord } = await supabase
      .from('processed_images')
      .select('id')
      .eq('product_id', productId)
      .is('model_id', null)
      .single();

    if (existingRecord) {
      // 5. إذا كان السجل موجود، نحدّثه
      const { data, error } = await supabase
        .from('processed_images')
        .update({
          processed_image_url: manualImageUrl,
          video_url: manualVideoUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('product_id', productId)
        .is('model_id', null)
        .select()
        .single();

      if (error) {
        console.error('❌ Update error:', error);
        throw error;
      }

      console.log('✅ Manual media updated successfully');
      return NextResponse.json({
        success: true,
        message: 'Manual media updated',
        data,
      });
    } else {
      // 6. إذا السجل مش موجود، نضيف واحد جديد
      const { data, error } = await supabase
        .from('processed_images')
        .insert([
          {
            product_id: productId,
            model_id: null, // NULL للمحتوى اليدوي
            processed_image_url: manualImageUrl,
            video_url: manualVideoUrl,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('❌ Insert error:', error);
        throw error;
      }

      console.log('✅ Manual media saved successfully');
      return NextResponse.json({
        success: true,
        message: 'Manual media created',
        data,
      });
    }
  } catch (error) {
    console.error('❌ Error receiving manual media:', error);
    return NextResponse.json(
      {
        error: 'Failed to save manual media',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET - جلب الفيديو والصورة اليدوية لمنتج معين (اختياري)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('processed_images')
      .select('*')
      .eq('product_id', productId)
      .is('model_id', null)
      .single();

    if (error) {
      // إذا مش موجود، نرجع null
      return NextResponse.json({ data: null });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching manual media:', error);
    return NextResponse.json(
      { error: 'Failed to fetch manual media' },
      { status: 500 }
    );
  }
}