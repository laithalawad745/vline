'use client';

import type { Product } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const msg = 'مرحباً، أنا مهتم بـ ' + product.name;
  const url = 'https://wa.me/963954616878?text=' + encodeURIComponent(msg);

  return (
    <div className="group relative bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 ease-out border border-transparent hover:border-[#ec4899]/50 ">
      {/* Image Container */}
      <Link href={'/product/' + product.id} className="block">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#6366f1]/10 to-[#ec4899]/10">
          <Image
            src={product.original_image_url}
            alt={product.name}
            fill
            className="object-cover  transition-transform duration-1000 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"></div>
          
          {/* Quick View Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out">
            <button className="px-6 py-3 bg-white text-[#6366f1] font-bold rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 ease-out flex items-center gap-2">
              عرض المنتج
            </button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-5">
        <Link href={'/product/' + product.id}>
          <h3 className="font-bold text-lg mb-2 text-[#ec4899]  transition-colors duration-500 ease-out line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Price */}
        {product.price && (
          <div className="mb-4">
            <p className="text-2xl font-bold bg-gradient-to-r from-[#6366f1] to-[#ec4899] bg-clip-text text-transparent">
              {product.price.toLocaleString('ar-SY')} ل.س
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            href={'/product/' + product.id}
            className="flex-1 bg-gradient-to-r from-[#6366f1] to-[#ec4899] text-white py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-500 ease-out text-center font-medium relative overflow-hidden group/btn"
          >
            <span className="relative z-10">شاهد التفاصيل</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#ec4899] to-[#6366f1] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 ease-out"></div>
          </Link>
          
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white p-3 rounded-xl hover:bg-green-600 hover:shadow-lg transition-all duration-500 ease-out"
            title="تواصل عبر واتساب"
          >
            <MessageCircle className="h-5 w-5" />
          </a>
        </div>
      </div>

      {/* Decorative Corner Gradient */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-[#6366f1]/20 to-transparent rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"></div>
    </div>
  );
}