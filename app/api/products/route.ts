import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// دالة للتحقق من أن المستخدم Admin
async function checkAdmin() {
  const cookieStore = await cookies();

  const supabaseServer = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { session } } = await supabaseServer.auth.getSession();

  if (!session) {
    return { authorized: false, error: 'غير مسجل دخول' };
  }

  const { data: profile } = await supabaseServer
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (profile?.role !== 'admin') {
    return { authorized: false, error: 'غير مصرح' };
  }

  return { authorized: true };
}

// 🆕 دالة لإرسال إشعار لموقع CenterStore
async function notifyCenterStore(productData: any) {
  const centerStoreUrl = process.env.CENTER_STORE_WEBHOOK_URL;
  const webhookSecret = process.env.WEBHOOK_SECRET;
  const storeId = process.env.NEXT_PUBLIC_STORE_ID;
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME;

  // إذا ما في webhook URL، نتخطى الإرسال
  if (!centerStoreUrl) {
    console.log('⚠️ CENTER_STORE_WEBHOOK_URL not configured, skipping notification');
    return;
  }

  try {
    console.log('📤 Sending notification to CenterStore...');
    console.log('🏪 Store:', storeName, '(ID:', storeId, ')');
    
    const response = await fetch(centerStoreUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': webhookSecret || '',
      },
      body: JSON.stringify({
        event: 'product.created',
        timestamp: new Date().toISOString(),
        store: {
          id: storeId,
          name: storeName,
          url: process.env.NEXT_PUBLIC_SITE_URL || 'https://vline.com',
        },
        product: {
          id: productData.id,
          name: productData.name,
          description: productData.description,
          price: productData.price,
          category: productData.category,
          original_image_url: productData.original_image_url,
          created_at: productData.created_at,
        },
      }),
    });

    if (!response.ok) {
      console.error('❌ Failed to notify CenterStore:', response.statusText);
    } else {
      console.log('✅ CenterStore notified successfully');
    }
  } catch (error) {
    console.error('❌ Error notifying CenterStore:', error);
    // لا نوقف العملية إذا فشل الإرسال
  }
}

// GET - جلب جميع المنتجات (متاح للجميع)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST - إضافة منتج جديد (للأدمن فقط)
export async function POST(request: Request) {
  // التحقق من الصلاحيات
  const auth = await checkAdmin();
  if (!auth.authorized) {
    return NextResponse.json(
      { error: auth.error },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name: body.name,
          description: body.description,
          price: body.price,
          category: body.category,
          original_image_url: body.original_image_url,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // 🆕 إرسال إشعار لموقع CenterStore
    await notifyCenterStore(data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

// PATCH - تحديث منتج (للأدمن فقط)
export async function PATCH(request: Request) {
  // التحقق من الصلاحيات
  const auth = await checkAdmin();
  if (!auth.authorized) {
    return NextResponse.json(
      { error: auth.error },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('products')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE - حذف منتج (للأدمن فقط)
export async function DELETE(request: Request) {
  // التحقق من الصلاحيات
  const auth = await checkAdmin();
  if (!auth.authorized) {
    return NextResponse.json(
      { error: auth.error },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}