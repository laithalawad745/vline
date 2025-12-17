import { getProductById, getProcessedImages } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, MessageCircle, Eye, ShoppingBag, Sparkles, Heart } from 'lucide-react';
import { ProcessedImagesGallery } from '@/components/ProcessedImagesGallery';
import { ProductImageWithDownload } from '@/components/ProductImageWithDownload';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage(props: PageProps) {
  const params = await props.params;
  const product = await getProductById(params.id);
  
  if (!product) {
    notFound();
  }

  const processedImages = await getProcessedImages(params.id);
  const msg = 'مرحباً، أنا مهتم بـ ' + product.name;
  const url = 'https://wa.me/963954616878?text=' + encodeURIComponent(msg);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-[#6366f1] to-[#ec4899] shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full group-hover:scale-110 transition-transform duration-300">
                <ShoppingBag className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
                   Vline
                </h1>
              </div>
            </Link>
            
            <div className="flex items-center gap-3">
              <Link 
                href="/products"
                className="hidden md:flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-2.5 rounded-full text-white font-medium hover:bg-white/30 transition-all duration-300 hover:scale-105"
              >
                <ShoppingBag className="h-5 w-5" />
                <span>جميع المنتجات</span>
              </Link>

              <Link 
                href="/products"
                className="md:hidden bg-white/20 backdrop-blur-sm p-2.5 rounded-full text-white hover:bg-white/30 transition-all duration-300 hover:scale-105"
              >
                <ShoppingBag className="h-5 w-5" />
              </Link>

            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-secondary/30 border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              الرئيسية
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-foreground transition-colors">
              المنتجات
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <ProductImageWithDownload 
            imageUrl={product.original_image_url}
            productName={product.name}
          />

          {/* Product Info */}
          <div className="flex flex-col justify-center space-y-6">
            {product.category && (
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6366f1]/10 to-[#ec4899]/10 border border-[#ec4899]/30 px-4 py-2 rounded-full w-fit">
           
                <span className="text-sm text-[#ec4899] font-medium">{product.category}</span>
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-[#6366f1] to-[#ec4899] bg-clip-text text-transparent">
                {product.name}
              </span>
            </h1>
            
            {product.description && (
              <p className="text-xl text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            )}

            {product.price && (
              <div className="bg-gradient-to-r from-[#6366f1]/10 to-[#ec4899]/10 border border-[#ec4899]/30 rounded-2xl p-6">
                <p className="text-sm text-muted-foreground mb-2">السعر</p>
                <p className="text-5xl font-bold bg-gradient-to-r from-[#6366f1] to-[#ec4899] bg-clip-text text-transparent">
                  {product.price.toLocaleString('ar-SY')} <span className="text-3xl">ل.س</span>
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white py-4 px-8 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-500 ease-out hover:scale-[1.02] group"
              >
                تواصل معنا عبر واتساب
              </a>

            
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="bg-card border border-border rounded-xl p-4 text-center hover:border-[#6366f1] transition-all duration-300">
                <Sparkles className="h-8 w-8 mx-auto mb-2 text-[#6366f1]" />
                <p className="text-sm text-muted-foreground font-medium">جودة عالية</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 text-center hover:border-[#ec4899] transition-all duration-300">
                <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-[#ec4899]" />
                <p className="text-sm text-muted-foreground font-medium">توصيل سريع</p>
              </div>
            </div>
          </div>
        </div>

        {/* Try On Section */}
        {processedImages.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#6366f1]/10 to-[#ec4899]/10 px-6 py-3 rounded-full mb-6 border border-[#ec4899]/30">
                <span className="font-medium text-muted-foreground">جربي قبل الشراء</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-[#6366f1] to-[#ec4899] bg-clip-text text-transparent">
                  شاهدي المنتج على الموديل
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                اضغطي على الصورة لرؤية المنتج بشكل واضح
              </p>
            </div>
            <ProcessedImagesGallery images={processedImages} />
          </div>
        )}

        {/* Back Button */}
        <div className="mt-16 text-center">
          <Link 
            href="/products"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            العودة لجميع المنتجات
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#1e1b4b] to-[#831843] text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold">Vline</h3>
            </div>
            <p className="text-white/80 mb-6">
              وجهتك للأناقة والموضة النسائية
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-white/70">
              <span>© 2026 Vline</span>
            
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}