import { getProducts } from '@/lib/supabase';
import { ProductCard } from '@/components/ProductCard';
import { ShoppingBag, Sparkles, Heart, Star } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 60;

export default async function HomePage() {
  const products = await getProducts(true);

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Gradient */}
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
              {/* Desktop Button */}
              <Link 
                href="/products"
                className="hidden md:flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-2.5 rounded-full text-white font-medium hover:bg-white/30 transition-all duration-300 hover:scale-105"
              >
                <ShoppingBag className="h-5 w-5" />
                <span>جميع المنتجات</span>
              </Link>

              {/* Mobile Button */}
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

      {/* Hero Section with Animated Gradient */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/20 via-[#ec4899]/20 to-[#6366f1]/20 gradient-animate"></div>
        
 
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
         

            <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-[#6366f1] to-[#ec4899] bg-clip-text text-transparent">
                أحدث صيحات
              </span>
              <br />
              <span className="text-foreground">الموضة النسائية</span>
            </h2>

            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              اكتشفي مجموعتنا الحصرية من الملابس العصرية التي تجمع بين الأناقة والجودة
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* <button className="group relative px-8 py-4 bg-gradient-to-r from-[#6366f1] to-[#ec4899] text-white font-bold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <span className="relative z-10 flex items-center gap-2">
                  تسوقي الآن
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#ec4899] to-[#6366f1] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button> */}

                        <Link 
                href="/products"
                className="group relative px-8 py-4 bg-gradient-to-r from-[#6366f1] to-[#ec4899] text-white font-bold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <span>  تسوقي الآن </span>
              </Link>

              {/* Mobile Button */}
              {/* <Link 
                href="/products"
                className="md:hidden bg-white/20 backdrop-blur-sm p-2.5 rounded-full text-white hover:bg-white/30 transition-all duration-300 hover:scale-105"
              >
                 <span>  تسوقي الآن </span>
              </Link> */}
            </div>
          </div>
        </div>

    
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-background to-[#fce7f3]/10 dark:to-[#1e1b4b]/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-card border border-[#ec4899]/20 hover:border-[#ec4899] transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#6366f1] to-[#ec4899] rounded-full flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">جودة عالية</h3>
              <p className="text-muted-foreground">أقمشة فاخرة وتصاميم راقية</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-card border border-[#6366f1]/20 hover:border-[#6366f1] transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#ec4899] to-[#6366f1] rounded-full flex items-center justify-center">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">تصاميم حصرية</h3>
              <p className="text-muted-foreground">موديلات جديدة كل أسبوع</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-card border border-[#ec4899]/20 hover:border-[#ec4899] transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#6366f1] to-[#ec4899] rounded-full flex items-center justify-center">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">خدمة مميزة</h3>
              <p className="text-muted-foreground">تواصل سريع عبر واتساب</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#6366f1] to-[#ec4899] bg-clip-text text-transparent">
              منتجاتنا المميزة
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            اختاري من تشكيلتنا الواسعة التي تناسب ذوقك العصري
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-[#ec4899]">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#6366f1]/20 to-[#ec4899]/20 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-[#ec4899]" />
            </div>
           
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1] to-[#ec4899] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center bg-card rounded-3xl p-12 shadow-2xl border border-[#ec4899]/20">
            <h2 className="text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#6366f1] to-[#ec4899] bg-clip-text text-transparent">
                  تواصل معنا
              </span>
            </h2>
         
            <Link
              href="https://wa.me/963954616878"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[#6366f1] to-[#ec4899] text-white font-bold rounded-full text-lg  transition-transform duration-300 shadow-xl"
            >
              تواصلي معنا عبر واتساب
            </Link>

            
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#1e1b4b] to-[#831843] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold"> Vline</h3>
            </div>
            <p className="text-white/80 mb-6">
              وجهتك للأناقة والموضة النسائية
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-white/70">
              <span>© 2026  Vline</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}