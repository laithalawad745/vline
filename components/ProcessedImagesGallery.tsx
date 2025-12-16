'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';

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
          <div
            key={image.id}
            className="bg-card rounded-lg overflow-hidden shadow-lg border border-border"
          >
            {/* صورة الموديل */}
            <div className="relative aspect-[3/4] bg-secondary/20">
              <Image
                src={
                  isVisible
                    ? image.processed_image_url
                    : image.models.image_url
                }
                alt={image.models.name}
                fill
                className="object-cover transition-all duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              
              {/* Overlay عند عدم الظهور */}
              {!isVisible && (
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center">
                  <div className="text-white text-center">
                    <EyeOff className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  </div>
                </div>
              )}
            </div>

            {/* زر التحكم */}
            <div className="p-4">
              <p className="font-medium mb-3">{image.models.name}</p>
              <button
                onClick={() => toggleImage(image.id)}
                className={`w-full py-2 px-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 ${
                  isVisible
                    ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                {isVisible ? (
                  <>
                    <EyeOff className="h-5 w-5" />
                    إخفاء الصورة
                  </>
                ) : (
                  <>
                    <Eye className="h-5 w-5" />
                    عرض على الموديل
                  </>
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}