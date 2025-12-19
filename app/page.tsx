import { getProducts } from '@/lib/supabase';
import { ProductCard } from '@/components/ProductCard';
import { ShoppingBag, Sparkles, Heart, Star, MapPin, Clock, Menu, Search,MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 60;

export default async function HomePage() {
  const products = await getProducts(true);

  return (
    <div className="min-h-screen bg-[#131022] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#131022]/95 backdrop-blur-lg border-b border-white/5 px-4 py-3">
        <div className="flex  items-center justify-center">
  
          
          <h2 className="text-xl font-bold tracking-tight">Vline</h2>
          
     
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative">
        <div className="relative min-h-[520px] flex flex-col items-center justify-end p-6 pb-12 bg-cover bg-center rounded-xl mx-4 mt-4 overflow-hidden"
          style={{
            backgroundImage: 'linear-gradient(rgba(19, 16, 34, 0.1) 0%, rgba(19, 16, 34, 0.6) 50%, rgba(19, 16, 34, 1) 100%), url("https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800")'
          }}>
          
    

          {/* Hero Content */}
          <div className="flex flex-col gap-3 text-center items-center max-w-[480px] relative z-10">
            <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
              الأناقة العصرية
            </h1>
            <h2 className="text-gray-200 text-base font-normal leading-normal max-w-xs">
            اكتشفي أحدث صيحات الموضة 
            </h2>
          </div>

          <Link 
            href="/products"
            className="mt-6 relative z-10 min-w-[140px] px-6 h-12 flex items-center justify-center bg-[#3713ec] hover:bg-[#3713ec]/90 rounded-xl text-white text-base font-bold shadow-lg shadow-[#3713ec]/25 transition-all"
          >
             المنتجات
          </Link>
        </div>
      </div>

      {/* Features Chips */}
      {/* <div className="flex gap-3 px-4 py-6 overflow-x-auto no-scrollbar">
        <div className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-[#292348] border border-white/5 px-4 shadow-sm">
          <Sparkles className="h-5 w-5 text-[#3713ec]" />
          <p className="text-white text-sm font-medium whitespace-nowrap">توليد AI</p>
        </div>
 
        <div className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-[#292348] border border-white/5 px-4 shadow-sm">
          <Star className="h-5 w-5 text-[#3713ec]" />
          <p className="text-white text-sm font-medium whitespace-nowrap">جودة مضمونة</p>
        </div>
        <div className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-[#292348] border border-white/5 px-4 shadow-sm">
          <ShoppingBag className="h-5 w-5 text-[#3713ec]" />
          <p className="text-white text-sm font-medium whitespace-nowrap">توصيل سريع</p>
        </div>
      </div> */}

      {/* Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-2"></div>

      {/* Products Section Header */}
      <div className="flex items-center justify-between px-4 pb-4 pt-6">
        <h2 className="text-2xl font-bold leading-tight">الاكثر مبيعا</h2>
        <Link href="/products" className="text-[#3713ec] text-sm font-bold flex items-center gap-1">
          عرض الكل
          <span className="text-sm">←</span>
        </Link>
      </div>

      {/* Products Grid */}
      <div className="px-4 pb-8">
        {products.length === 0 ? (
          <div className="text-center py-20 bg-[#1a162e] rounded-3xl border border-white/5">
            <div className="w-24 h-24 mx-auto mb-6 bg-[#3713ec]/20 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-[#3713ec]" />
            </div>
            <h3 className="text-xl font-bold mb-2">لا توجد منتجات حالياً</h3>
            <p className="text-gray-400">قريباً... منتجات رائعة في الطريق إليك</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {products.slice(0, 4).map((product) => (
              <Link 
                key={product.id}
                href={`/product/${product.id}`}
                className="flex flex-col gap-3 group"
              >
                <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-white/5">
                  <Image
                    src={product.original_image_url}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  
                  {/* Heart Icon */}
                  <div className="absolute top-2 right-2 bg-black/40 backdrop-blur rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="h-4 w-4 text-white" />
                  </div>
                </div>
                
                <div>
                  <p className="text-white text-base font-bold leading-normal truncate">
                    {product.name}
                  </p>
                  {product.price && (
                    <p className="text-[#9b92c9] text-sm font-normal mt-1">
                      {product.price.toLocaleString('ar-SY')} ل.س
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* View All Button */}
        {products.length > 4 && (
          <div className="mt-8 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#3713ec] text-white font-bold rounded-xl hover:bg-[#3713ec]/90 transition-colors"
            >
               جميع المنتجات 
            </Link>
          </div>
        )}
      </div>

      {/* About Section */}
      <div className="px-4 py-8 bg-[#1a162e]">
        <div className="flex flex-col gap-4 text-center">
          <div className="size-16 rounded-full bg-[#3713ec]/20 flex items-center justify-center mx-auto text-[#3713ec] mb-2">
            <Sparkles className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold">عن Vline</h3>
          <p className="text-gray-300 text-sm leading-relaxed max-w-md mx-auto">
            نجمع بين أحدث صيحات الموضة العالمية وتقنيات الذكاء الاصطناعي لنقدم لك تجربة تسوق فريدة. 
            كل قطعة لدينا مختارة بعناية لتناسب ذوقك الرفيع.
          </p>
        </div>
      </div>

      {/* Location Section */}
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
      <div className="px-5 pb-6 pt-6">
        <Link
          href="https://wa.me/963954616878?text=مرحباً، أود الاستفسار عن منتجاتكم."
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