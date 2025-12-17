'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Eye, Download } from 'lucide-react';

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
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {images.map((image) => {
        const isVisible = visibleImages.has(image.id);

        return (
          <div key={image.id} className="bg-card rounded-2xl overflow-hidden shadow-lg border border-border hover:border-[#ec4899]/50 transition-all duration-500 ease-out hover:scale-[1.02]">
            {isVisible ? (
              <div className="relative aspect-[3/4] bg-gradient-to-br from-[#6366f1]/5 to-[#ec4899]/5">
                <Image 
                  src={image.processed_image_url} 
                  alt={image.models.name} 
                  fill 
                  className="object-cover" 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                />
              </div>
            ) : (
              <div className="relative aspect-[3/4] bg-gradient-to-br from-[#6366f1]/10 to-[#ec4899]/10 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#6366f1]/20 to-[#ec4899]/20 rounded-full flex items-center justify-center">
                    <Eye className="h-10 w-10 text-[#ec4899]" />
                  </div>
            
                </div>
              </div>
            )}

            <div className="p-5 space-y-3">
              <button 
                onClick={() => toggleImage(image.id)} 
                className={`w-full py-3 px-4 rounded-xl transition-all duration-500 ease-out font-medium flex items-center justify-center gap-2 ${
                  isVisible 
                    ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' 
                    : 'bg-gradient-to-r from-[#6366f1] to-[#ec4899] text-white hover:shadow-lg'
                }`}
              >
                {isVisible ? 'إخفاء الصورة' : 'عرض على الموديل'}
              </button>

              {isVisible && (
                <button
                  onClick={() => downloadImage(image.processed_image_url, `${image.models.name}.jpg`)}
                  className="w-full flex items-center justify-center gap-2 bg-card border-2 border-[#6366f1] text-foreground px-4 py-3 rounded-xl font-medium hover:bg-[#6366f1] hover:text-white transition-all duration-300"
                >
                  <Download className="h-5 w-5" />
                  تحميل الصورة
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}