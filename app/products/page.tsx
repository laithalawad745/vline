import { getProducts } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Search, Heart, Sparkles } from 'lucide-react';

export const revalidate = 60;

export default async function ProductsPage() {
  const products = await getProducts(true);

  return (
    <div className="min-h-screen bg-[#131022] text-white pb-8">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#131022]/95 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center px-4 py-3 justify-between">
          {/* Back Button */}
          <Link href="/" className="flex size-10 shrink-0 items-center justify-start cursor-pointer text-white">
            <ArrowRight className="h-6 w-6" />
          </Link>
          
          <h2 className="text-base font-bold leading-tight tracking-tight flex-1 text-center">
             جميع المنتجات
          </h2>
          
      
        </div>

        {/* Category Chips */}
        {/* <div className="flex gap-3 px-4 pb-3 overflow-x-auto no-scrollbar w-full">
          <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#292348] px-3 cursor-pointer active:scale-95 transition-transform">
            <p className="text-white text-xs font-medium leading-normal">تصنيف</p>
          </div>
          <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full border border-white/10 bg-transparent px-3 cursor-pointer hover:bg-[#292348]/50 transition-colors">
            <p className="text-white text-xs font-medium leading-normal">فساتين</p>
          </div>
          <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full border border-white/10 bg-transparent px-3 cursor-pointer hover:bg-[#292348]/50 transition-colors">
            <p className="text-white text-xs font-medium leading-normal">عبايات</p>
          </div>
          <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full border border-white/10 bg-transparent px-3 cursor-pointer hover:bg-[#292348]/50 transition-colors">
            <p className="text-white text-xs font-medium leading-normal">تنورات</p>
          </div>
          <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full border border-white/10 bg-transparent px-3 cursor-pointer hover:bg-[#292348]/50 transition-colors">
            <p className="text-white text-xs font-medium leading-normal">أطقم</p>
          </div>
        </div> */}


      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 px-4 pt-4">
        {products.length === 0 ? (
          <div className="col-span-2 text-center py-20">
            <p className="text-gray-400">لا توجد منتجات حالياً</p>
          </div>
        ) : (
          products.map((product) => (
            <Link 
              key={product.id}
              href={`/product/${product.id}`}
              className="flex flex-col gap-3 group cursor-pointer"
            >
              {/* Product Image */}
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl">
                <Image
                  src={product.original_image_url}
                  alt={product.name}
                  fill
                  className="object-cover transition-all duration-[2000ms] ease-in-out group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                
           
              </div>

              {/* Product Info */}
              <div>
                <div className="flex justify-between items-start">
                  <p className="text-white text-base font-bold leading-normal line-clamp-1">
                    {product.name}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {product.price && (
                    <>
                      <p className="text-[#3713ec] text-sm font-bold leading-normal">
                        {product.price.toLocaleString('ar-SY')} ل.س
                      </p>
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    </>
                  )}
                  <p className="text-[#9b92c9] text-xs font-normal">جرب الآن</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}