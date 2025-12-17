import { getProducts } from '@/lib/supabase';
import { ProductCard } from '@/components/ProductCard';
import { ShoppingBag, Sparkles, Filter, Search } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 60;

export default async function ProductsPage() {
  const products = await getProducts(true);

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
                <p className="text-xs text-white/80">أناقة بلا حدود</p>
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

      {/* Page Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#6366f1]/10 via-[#ec4899]/10 to-[#6366f1]/10 py-16">
       

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-black/30 backdrop-blur-sm px-6 py-2 rounded-full mb-6 border border-[#ec4899]/30">
            <ShoppingBag className="h-5 w-5 text-[#ec4899]" />
            <span className="text-sm font-medium text-foreground">
              {products.length} منتج متوفر
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#6366f1] to-[#ec4899] bg-clip-text text-transparent">
              جميع المنتجات
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            اكتشفي مجموعتنا الكاملة من أفضل وأحدث الملابس النسائية
          </p>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="bg-card border-y border-border sticky top-[72px] z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Filter className="h-5 w-5" />
              <span className="font-medium">تصفية حسب:</span>
              <button className="px-4 py-2 bg-gradient-to-r from-[#6366f1] to-[#ec4899] text-white rounded-full text-sm font-medium hover:shadow-lg transition-all duration-300">
                الكل
              </button>
            </div>
            
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <Search className="h-5 w-5" />
              <input
                type="text"
                placeholder="ابحث عن منتج..."
                className="px-4 py-2 bg-background border border-input rounded-full focus:outline-none focus:ring-2 focus:ring-[#ec4899] transition-all duration-300 w-64"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-12">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#6366f1]/20 to-[#ec4899]/20 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-16 w-16 text-[#ec4899]" />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                <span className="bg-gradient-to-r from-[#6366f1] to-[#ec4899] bg-clip-text text-transparent">
                  لا توجد منتجات حالياً
                </span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                قريباً... منتجات رائعة في الطريق إليك
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#6366f1] to-[#ec4899] text-white font-bold rounded-full hover:shadow-lg transition-all duration-300"
              >
                العودة للرئيسية
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full p-2">
                <button className="w-10 h-10 rounded-full bg-gradient-to-r from-[#6366f1] to-[#ec4899] text-white font-bold hover:shadow-lg transition-all duration-300">
                  1
                </button>
                <button className="w-10 h-10 rounded-full hover:bg-secondary transition-all duration-300 text-muted-foreground hover:text-foreground">
                  2
                </button>
                <button className="w-10 h-10 rounded-full hover:bg-secondary transition-all duration-300 text-muted-foreground hover:text-foreground">
                  3
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#1e1b4b] to-[#831843] text-white py-12 mt-20">
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
