import { getProductById, getProcessedImages } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MessageCircle, Eye } from 'lucide-react';
import { ProcessedImagesGallery } from '@/components/ProcessedImagesGallery';

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
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowRight className="h-5 w-5" />
            العودة للرئيسية
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-secondary/20">
            <Image src={product.original_image_url} alt={product.name} fill className="object-cover" priority />
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            
            {product.description && (
              <p className="text-lg text-muted-foreground mb-6">{product.description}</p>
            )}

            {product.price && (
              <p className="text-4xl font-bold text-primary mb-6">
                {product.price.toLocaleString('ar-SY')} ل.س
              </p>
            )}

            {product.category && (
              <p className="text-sm text-muted-foreground mb-6">التصنيف: {product.category}</p>
            )}

            <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium text-lg">
              <MessageCircle className="h-6 w-6" />
              تواصل معنا عبر واتساب
            </a>
          </div>
        </div>

        {processedImages.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold">شاهد المنتج على الموديل</h2>
            </div>
            <ProcessedImagesGallery images={processedImages} />
          </div>
        )}
      </div>
    </div>
  );
}