'use client';

import { useState, useEffect } from 'react';
import { getProductById, getProcessedImages } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Share2, Heart, Sparkles, Download, MessageCircle, Truck } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: PageProps) {
  const [product, setProduct] = useState<any>(null);
  const [processedImages, setProcessedImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleModels, setVisibleModels] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadData = async () => {
      const resolvedParams = await params;
      const productData = await getProductById(resolvedParams.id);
      
      if (!productData) {
        notFound();
      }
      
      setProduct(productData);
      const images = await getProcessedImages(resolvedParams.id);
      setProcessedImages(images);
      setLoading(false);
    };

    loadData();
  }, [params]);

  const downloadImage = async (imageUrl: string, fileName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('حدث خطأ في تحميل الصورة');
    }
  };

  const toggleModelVisibility = (modelId: string) => {
    setVisibleModels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(modelId)) {
        newSet.delete(modelId);
      } else {
        newSet.add(modelId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#131022] flex items-center justify-center">
        <div className="text-white">جاري التحميل...</div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const msg = 'مرحباً، أنا مهتم بـ ' + product.name;
  const whatsappUrl = 'https://wa.me/963954616878?text=' + encodeURIComponent(msg);

  return (
    <div className="min-h-screen bg-[#131022] text-white pb-8">
      {/* Sticky Navigation Bar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-[#131022]/90 backdrop-blur-md border-b border-white/10">
        <Link href="/products" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 active:scale-95 transition-transform">
          <ArrowRight className="h-5 w-5" />
        </Link>

      </nav>

      {/* Product Image */}
      <div className="relative w-full h-[500px] bg-[#1e1b2e] overflow-hidden">
        <Image
          src={product.original_image_url}
          alt={product.name}
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Product Info */}
      <div className="px-5 pt-6">
        <h1 className="text-3xl font-bold leading-tight mb-2">{product.name}</h1>
        
        {product.price && (
          <p className="text-[#3713ec] text-2xl font-bold mb-4">
            {product.price.toLocaleString('ar-SY')} ل.س
          </p>
        )}

        {product.description && (
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            {product.description}
          </p>
        )}

        {/* Download Original Image Button */}
        <button
          onClick={() => downloadImage(product.original_image_url, `${product.name}.jpg`)}
          className="w-full flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white py-3 rounded-xl font-medium mb-6 hover:bg-white/20 transition-colors"
        >
          <Download className="h-5 w-5" />
          تحميل صورة المنتج
        </button>
      </div>

      {/* 2 Feature Boxes Only */}
      <div className="px-5 mb-6">
        <div className="grid grid-cols-2 gap-3">
          {/* Box 1 - Quality */}
          <div className="bg-[#1e1b2e] border border-white/10 rounded-xl p-4 text-center">
            <Sparkles className="h-8 w-8 mx-auto mb-2 text-[#3713ec]" />
            <p className="text-xs text-gray-400 font-medium">جودة عالية</p>
          </div>

          {/* Box 2 - Delivery */}
          <div className="bg-[#1e1b2e] border border-white/10 rounded-xl p-4 text-center">
            <Truck className="h-8 w-8 mx-auto mb-2 text-[#3713ec]" />
            <p className="text-xs text-gray-400 font-medium">توصيل سريع</p>
          </div>
        </div>
      </div>

      {/* AI Models Section - Always Visible */}
      {processedImages.length > 0 && (
        <div className="px-5 mb-6">
          <div className="bg-[#1e1b2e]/50 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-[#3713ec]" />
              <h3 className="text-base font-bold">شاهدي المنتج على الموديل</h3>
            </div>
            
            {/* Mobile: 1 column (full width), Tablet+: 2-4 columns with max-width */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {processedImages.map((image) => {
                const isVisible = visibleModels.has(image.id);

                return (
                  <div key={image.id} className="space-y-2">
                    {isVisible ? (
                      <>
                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/10">
                          <Image
                            src={image.processed_image_url}
                            alt={image.models.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="text-xs text-gray-400 text-center">{image.models.name}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleModelVisibility(image.id)}
                            className="flex-1 bg-[#1e1b2e] border border-white/20 text-white py-2 rounded-lg text-xs font-bold hover:bg-white/5 transition-colors"
                          >
                            إخفاء
                          </button>
                          <button
                            onClick={() => downloadImage(image.processed_image_url, `${product.name}-${image.models.name}.jpg`)}
                            className="flex-1 flex items-center justify-center gap-1 bg-[#3713ec]/20 border border-[#3713ec]/30 text-[#3713ec] py-2 rounded-lg text-xs font-bold hover:bg-[#3713ec] hover:text-white transition-colors"
                          >
                            <Download className="h-3 w-3" />
                            تحميل
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#6366f1]/20 to-[#ec4899]/20 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-3 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                            </div>
                            <p className="text-xs text-gray-300">{image.models.name}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleModelVisibility(image.id)}
                          className="w-full bg-[#3713ec]/20 border border-[#3713ec]/30 text-[#3713ec] py-2 rounded-lg text-xs font-bold hover:bg-[#3713ec] hover:text-white transition-colors"
                        >
                          عرض على الموديل
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Button */}
      <div className="px-5 mb-6">
        <Link
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] hover:bg-[#20ba5a] rounded-2xl text-white font-bold text-lg shadow-xl active:scale-[0.98] transition-all"
        >
          <MessageCircle className="h-6 w-6" />
          تواصل معنا عبر واتساب
        </Link>
      </div>
    </div>
  );
}