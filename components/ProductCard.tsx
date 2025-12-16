'use client';

import { Product } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const whatsappMessage = encodeURIComponent(
    `مرحباً، أنا مهتم بـ ${product.name}`
  );
  const whatsappUrl = `https://wa.me/963954616878?text=${whatsappMessage}`;

  return (
    <div className="group bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-border">
      {/* صورة المنتج */}
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-secondary/20">
          <Image
            src={product.original_image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
      </Link>

      {/* معلومات المنتج */}
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-bold text-lg mb-2 hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {product.price && (
          <p className="text-2xl font-bold text-primary mb-4">
            {product.price.toLocaleString('ar-SY')} ل.س
          </p>
        )}

        <div className="flex gap-2">
          <Link
            href={`/products/${product.id}`}
            className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors text-center font-medium"
          >
            شاهد على الموديل
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
            title="تواصل عبر واتساب"
          >
            <MessageCircle className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  );
}