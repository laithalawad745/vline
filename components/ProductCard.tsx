'use client';

import type { Product } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const msg = 'مرحباً، أنا مهتم بـ ' + product.name;
  const url = 'https://wa.me/963954616878?text=' + encodeURIComponent(msg);

  return (
    <div className="flex flex-col gap-3 group">
      {/* Product Image */}
      <Link href={'/product/' + product.id}>
        <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-white/5 bg-[#1a162e]">
          <Image
            src={product.original_image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
          
          {/* Heart Icon on Hover */}
          <div className="absolute top-2 right-2 bg-black/40 backdrop-blur rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <Heart className="h-4 w-4 text-white" />
          </div>
          
          {/* WhatsApp Button on Hover */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#20ba5a] transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              واتساب
            </a>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div>
        <Link href={'/product/' + product.id}>
          <p className="text-white text-base font-bold leading-normal truncate hover:text-[#3713ec] transition-colors">
            {product.name}
          </p>
        </Link>
        
        {product.description && (
          <p className="text-gray-400 text-xs mt-1 line-clamp-2">
            {product.description}
          </p>
        )}
        
        {product.price && (
          <p className="text-[#9b92c9] text-sm font-normal mt-1">
            {product.price.toLocaleString('ar-SY')} ل.س
          </p>
        )}
      </div>
    </div>
  );
}