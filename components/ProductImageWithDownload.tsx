'use client';

import Image from 'next/image';
import { Download } from 'lucide-react';

interface ProductImageWithDownloadProps {
  imageUrl: string;
  productName: string;
}

export function ProductImageWithDownload({ imageUrl, productName }: ProductImageWithDownloadProps) {
  const downloadImage = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${productName}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('حدث خطأ في تحميل الصورة');
    }
  };

  return (
    <div className="relative">
      <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-[#6366f1]/10 to-[#ec4899]/10 shadow-2xl">
        <Image 
          src={imageUrl} 
          alt={productName} 
          fill 
          className="object-cover" 
          priority 
        />
    
      </div>
      
      {/* Download Button */}
      <div className="mt-4">
        <button
          onClick={downloadImage}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#6366f1] to-[#ec4899] text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
        >
          <Download className="h-5 w-5" />
          تحميل صورة المنتج
        </button>
      </div>
    </div>
  );
}