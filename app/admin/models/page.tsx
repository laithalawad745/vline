'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Plus, Trash2, Upload, Loader2 } from 'lucide-react';
import { uploadImage, Model } from '@/lib/supabase';

// مكون لتحميل الصورة مع إعادة المحاولة
function ImageWithRetry({ 
  src, 
  alt, 
  fill, 
  className,
  maxRetries = 3 
}: { 
  src: string; 
  alt: string; 
  fill?: boolean; 
  className?: string;
  maxRetries?: number;
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const [retryCount, setRetryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (retryCount < maxRetries) {
      console.log(`🔄 إعادة محاولة تحميل الصورة (${retryCount + 1}/${maxRetries}):`, src);
      
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setImgSrc(`${src}?retry=${retryCount + 1}`);
        setIsLoading(true);
      }, 1000 * (retryCount + 1));
    } else {
      console.error('❌ فشل تحميل الصورة بعد', maxRetries, 'محاولات:', src);
      setHasError(true);
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 animate-pulse flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 bg-destructive/10 flex items-center justify-center">
          <div className="text-center p-4">
            <p className="text-destructive text-sm font-medium">فشل التحميل</p>
            <p className="text-xs text-muted-foreground mt-1">بعد {maxRetries} محاولات</p>
          </div>
        </div>
      )}

      <Image
        src={imgSrc}
        alt={alt}
        fill={fill}
        className={className}
        onLoad={() => {
          setIsLoading(false);
          setHasError(false);
        }}
        onError={handleError}
        unoptimized
      />
    </>
  );
}

export default function AdminModelsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newModel, setNewModel] = useState({
    name: '',
    file: null as File | null,
  });

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      const response = await fetch('/api/models');
      const data = await response.json();
      setModels(data);
    } catch (error) {
      console.error('Error loading models:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewModel({ ...newModel, file: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModel.name || !newModel.file) {
      alert('الرجاء إدخال اسم الموديل واختيار صورة');
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await uploadImage('models', newModel.file);
      if (!imageUrl) {
        throw new Error('فشل رفع الصورة');
      }

      const response = await fetch('/api/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newModel.name,
          image_url: imageUrl,
          order_index: models.length,
        }),
      });

      if (response.ok) {
        setNewModel({ name: '', file: null });
        loadModels();
        alert('تمت إضافة الموديل بنجاح!');
      }
    } catch (error) {
      console.error('Error adding model:', error);
      alert('حدث خطأ أثناء إضافة الموديل');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الموديل؟')) return;

    try {
      const response = await fetch(`/api/models?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadModels();
        alert('تم حذف الموديل بنجاح');
      }
    } catch (error) {
      console.error('Error deleting model:', error);
      alert('حدث خطأ أثناء الحذف');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowRight className="h-5 w-5" />
            العودة للوحة التحكم
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">إدارة الموديلات</h1>

        {/* Add Model Form */}
        <div className="bg-card p-6 rounded-lg shadow border border-border mb-8">
          <h2 className="text-xl font-bold mb-4">إضافة موديل جديد</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                اسم الموديل
              </label>
              <input
                type="text"
                value={newModel.name}
                onChange={(e) =>
                  setNewModel({ ...newModel, name: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="مثال: موديل 1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                صورة الموديل
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full"
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="bg-primary text-primary-foreground py-2 px-6 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <Upload className="h-5 w-5 animate-spin" />
                  جاري الرفع...
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  إضافة موديل
                </>
              )}
            </button>
          </form>
        </div>

        {/* Models Grid */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">جاري التحميل...</p>
          </div>
        ) : models.length === 0 ? (
          <p className="text-center text-muted-foreground">
            لا توجد موديلات. أضف موديل أولاً.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {models.map((model) => (
              <div
                key={model.id}
                className="bg-card rounded-lg overflow-hidden shadow border border-border"
              >
                <div className="relative aspect-[3/4]">
                  <ImageWithRetry
                    src={model.image_url}
                    alt={model.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-2">{model.name}</h3>
                  <button
                    onClick={() => handleDelete(model.id)}
                    className="w-full bg-destructive text-destructive-foreground py-2 rounded-lg hover:bg-destructive/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}