import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - جلب جميع الصور المعالجة
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('processed_images')
      .select('*');

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching processed images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch processed images' },
      { status: 500 }
    );
  }
}