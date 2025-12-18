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
    <>
      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {/* عرض 3 منتجات على الموبايل و 8 على الشاشات الكبيرة */}
        {products.slice(0, 8).map((product, index) => (
          <div
            key={product.id}
            className={index >= 3 ? 'hidden md:block' : ''}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* View All Button */}
      {products.length > 8 && (
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#6366f1] to-[#ec4899] text-white font-bold rounded-full text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            عرض جميع المنتجات ({products.length})
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      )}
    </>
  )}
</section>
{/* Location Section - موقعنا */}
<section className="py-20 relative overflow-hidden bg-gradient-to-b from-background to-[#fce7f3]/10 dark:to-[#1e1b4b]/30">
  <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/5 to-[#ec4899]/5"></div>
  
  <div className="container mx-auto px-4 relative z-10">
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6366f1]/10 to-[#ec4899]/10 px-6 py-2 rounded-full mb-6 border border-[#ec4899]/30">
          <svg className="h-5 w-5 text-[#ec4899]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm font-medium text-muted-foreground">موقعنا</span>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-[#6366f1] to-[#ec4899] bg-clip-text text-transparent">
            موقعنا
          </span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
           تفضلي بزيارتنا في موقعنا
        </p>
      </div>

      {/* Map Container */}
      <div className="bg-card rounded-3xl overflow-hidden shadow-2xl border border-[#ec4899]/20">
        <div className="relative h-[400px] md:h-[500px]">
          {/* Google Maps Embed */}
   <iframe
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3362.5!2d36.101989!3d32.631317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzLCsDM3JzUyLjciTiAzNsKwMDYnMDcuMiJF!5e1!3m2!1sar!2s!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="transition-all duration-500"
          ></iframe>
        </div>

        {/* Location Details */}
        <div className="p-8 bg-gradient-to-br from-card to-[#fce7f3]/10 dark:to-[#1e1b4b]/30">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-[#6366f1] to-[#ec4899] p-3 rounded-xl flex-shrink-0">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">العنوان</h3>
                <p className="text-muted-foreground leading-relaxed">
                  درعا، 
                  <br />
                 كورنيش المطار
                </p>
              </div>
            </div>

            {/* Working Hours */}
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-[#ec4899] to-[#6366f1] p-3 rounded-xl flex-shrink-0">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">ساعات العمل</h3>
                <p className="text-muted-foreground leading-relaxed">
                  السبت - الخميس: 9 ص - 5 م
             
                </p>
              </div>
            </div>
          </div>

          {/* Get Directions Button */}
          <div className="mt-8 text-center">
            <Link
              href="https://www.google.com/maps/dir/?api=1&destination=32.631317,36.101989"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#6366f1] to-[#ec4899] text-white font-bold rounded-full text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
          
             Google Map 
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
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