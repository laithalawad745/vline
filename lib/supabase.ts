import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/auth-helpers-nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client للاستخدام العام (المنتجات، الموديلات، إلخ)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client للمصادقة (Auth)
export const supabaseAuth = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
);

// Types (نفس اللي موجود)
export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  category: string | null;
  original_image_url: string;
  created_at: string;
  is_visible: boolean;
}

export interface Model {
  id: string;
  name: string;
  image_url: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

export interface ProcessedImage {
  id: string;
  product_id: string;
  model_id: string;
  processed_image_url: string;
  created_at: string;
}

// Helper Functions (نفسها، ما بدها تتغير)
export async function uploadImage(
  bucket: string,
  file: File,
  path?: string
): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = path ? `${path}/${fileName}` : fileName;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) {
    console.error('Upload error:', error);
    return null;
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

export async function getProducts(visibleOnly = true) {
  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (visibleOnly) {
    query = query.eq('is_visible', true);
  }

  const { data, error } = await query;
  if (error) console.error(error);
  return data || [];
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) console.error(error);
  return data;
}

export async function getModels(activeOnly = true) {
  let query = supabase
    .from('models')
    .select('*')
    .order('order_index', { ascending: true });

  if (activeOnly) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;
  if (error) console.error(error);
  return data || [];
}

export async function getProcessedImages(productId: string) {
  const { data, error } = await supabase
    .from('processed_images')
    .select(`
      *,
      models:model_id (name, image_url)
    `)
    .eq('product_id', productId);

  if (error) console.error(error);
  return data || [];
}