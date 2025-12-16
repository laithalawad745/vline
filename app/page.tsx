import { getProducts } from '@/lib/supabase';
import { ProductCard } from '@/components/ProductCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 60; // إعادة التحقق كل 60 ثانية

export default async function HomePage() {
  const products = await getProducts(true);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">L Vline</h1>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            أحدث صيحات الموضة
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            اكتشف مجموعتنا الحصرية من الملابس العصرية
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-16">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-muted-foreground">
              لا توجد منتجات حالياً
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-secondary/50 mt-20 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 L Vline. جميع الحقوق محفوظة
          </p>
        </div>
      </footer>
    </div>
  );
}