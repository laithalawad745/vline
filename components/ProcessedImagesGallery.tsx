'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Eye } from 'lucide-react';

interface ProcessedImage {
  id: string;
  processed_image_url: string;
  models: {
    name: string;
    image_url: string;
  };
}

interface ProcessedImagesGalleryProps {
  images: ProcessedImage[];
}

export function ProcessedImagesGallery({ images }: ProcessedImagesGalleryProps) {
  const [visibleImages, setVisibleImages] = useState<Set<string>>(new Set());

  const toggleImage = (imageId: string) => {
    setVisibleImages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(imageId)) {
        newSet.delete(imageId);
      } else {
        newSet.add(imageId);
      }
      return newSet;
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image) => {
        const isVisible = visibleImages.has(image.id);

        return (
          <div key={image.id} className="bg-card rounded-lg overflow-hidden shadow-lg border border-border">
            {isVisible ? (
              <div className="relative aspect-[3/4] bg-secondary/20">
                <Image src={image.processed_image_url} alt={image.models.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
              </div>
            ) : (
              <div className="relative aspect-[3/4] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <div className="text-center p-8">
                  <Eye className="h-16 w-16 mx-auto mb-4 text-primary/40" />
                  <p className="text-lg font-medium text-muted-foreground">اضغط لمشاهدة المنتج</p>
                  <p className="text-sm text-muted-foreground mt-2">على {image.models.name}</p>
                </div>
              </div>
            )}

            <div className="p-4">
              <p className="font-medium mb-3">{image.models.name}</p>
              <button onClick={() => toggleImage(image.id)} className={`w-full py-2 px-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 ${isVisible ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}>
                <Eye className="h-5 w-5" />
                {isVisible ? 'إخفاء الصورة' : 'عرض على الموديل'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}