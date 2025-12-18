'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Plus, Trash2, Upload, Eye, EyeOff, CheckCircle2, Loader2 } from 'lucide-react';
import { uploadImage, Product, Model } from '@/lib/supabase';

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
      
      // إعادة المحاولة بعد تأخير تصاعدي
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setImgSrc(`${src}?retry=${retryCount + 1}`);
        setIsLoading(true);
      }, 1000 * (retryCount + 1)); // 1s, 2s, 3s
    } else {
      console.error('❌ فشل تحميل الصورة بعد', maxRetries, 'محاولات:', src);
      setHasError(true);
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 animate-pulse flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-destructive/10 flex items-center justify-center">
          <div className="text-center p-4">
            <p className="text-destructive text-sm font-medium">فشل التحميل</p>
            <p className="text-xs text-muted-foreground mt-1">بعد {maxRetries} محاولات</p>
          </div>
        </div>
      )}

      {/* Image */}
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

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    file: null as File | null,
  });
  
  // حالة جديدة لاختيار الموديلات (من 1 إلى 3)
  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, modelsRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/models'),
      ]);
      setProducts(await productsRes.json());
      setModels(await modelsRes.json());
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewProduct({ ...newProduct, file: e.target.files[0] });
    }
  };

  // دالة لاختيار/إلغاء اختيار موديل
  const toggleModelSelection = (modelId: string) => {
    setSelectedModels((prev) => {
      if (prev.includes(modelId)) {
        // إذا كان محدد، قم بإلغاء التحديد
        return prev.filter((id) => id !== modelId);
      } else {
        // إذا لم يكن محدد، تحقق من الحد الأقصى (3)
        if (prev.length >= 3) {
          alert('يمكنك اختيار 3 موديلات كحد أقصى');
          return prev;
        }
        return [...prev, modelId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProduct.name || !newProduct.file) {
      alert('الرجاء إدخال اسم المنتج واختيار صورة');
      return;
    }

    if (selectedModels.length === 0) {
      alert('الرجاء اختيار موديل واحد على الأقل (1-3 موديلات)');
      return;
    }

    setProcessing(true);
    setProgress({ current: 0, total: selectedModels.length });

    try {
      // 1. رفع صورة المنتج
      const imageUrl = await uploadImage('products', newProduct.file);
      if (!imageUrl) {
        throw new Error('فشل رفع الصورة');
      }

      // 2. حفظ المنتج في قاعدة البيانات
      const productRes = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProduct.name,
          description: newProduct.description,
          price: newProduct.price ? parseFloat(newProduct.price) : null,
          category: newProduct.category,
          original_image_url: imageUrl,
        }),
      });

      const product = await productRes.json();

      // 3. معالجة الصور مع الموديلات المحددة فقط
      for (let i = 0; i < selectedModels.length; i++) {
        const modelId = selectedModels[i];
        const model = models.find((m) => m.id === modelId);
        
        if (!model) continue;

        setProgress({ current: i + 1, total: selectedModels.length });

        try {
          const response = await fetch('/api/process-ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productId: product.id,
              productImageUrl: imageUrl,
              modelId: model.id,
              modelImageUrl: model.image_url,
            }),
          });

          if (!response.ok) {
            console.error(`Failed to process with model ${model.name}`);
          }
        } catch (error) {
          console.error(`Error processing with model ${model.name}:`, error);
        }
      }

      alert('تمت إضافة المنتج ومعالجته بنجاح!');
      setNewProduct({
        name: '',
        description: '',
        price: '',
        category: '',
        file: null,
      });
      setSelectedModels([]); // إعادة تعيين الاختيار
      loadData();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('حدث خطأ أثناء إضافة المنتج');
    } finally {
      setProcessing(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  const toggleVisibility = async (id: string, currentState: boolean) => {
    try {
      await fetch(`/api/products?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_visible: !currentState }),
      });
      loadData();
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;

    try {
      await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      loadData();
      alert('تم حذف المنتج بنجاح');
    } catch (error) {
      console.error('Error deleting product:', error);
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
        <h1 className="text-3xl font-bold mb-8">إدارة المنتجات</h1>

        {/* Add Product Form */}
        <div className="bg-card p-6 rounded-lg shadow border border-border mb-8">
          <h2 className="text-xl font-bold mb-4">إضافة منتج جديد</h2>
          
          {models.length === 0 && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
              <p className="text-destructive">
                تنبيه: لا توجد موديلات! الرجاء{' '}
                <Link href="/admin/models" className="underline font-bold">
                  إضافة موديلات أولاً
                </Link>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  اسم المنتج *
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="مثال: كنزة صوفية"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  السعر (ليرة سورية)
                </label>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="150000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                التصنيف
              </label>
              <input
                type="text"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="مثال: كنزات، تيشيرتات، إلخ"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                الوصف
              </label>
              <textarea
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                placeholder="وصف المنتج..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                صورة المنتج *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full"
              />
            </div>

            {/* Model Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">
                اختر الموديلات (1-3 موديلات) * 
                <span className="text-muted-foreground text-xs mr-2">
                  ({selectedModels.length}/3 محدد)
                </span>
              </label>
              
              {models.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  لا توجد موديلات متاحة
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {models.map((model) => {
                    const isSelected = selectedModels.includes(model.id);
                    
                    return (
                      <div
                        key={model.id}
                        onClick={() => toggleModelSelection(model.id)}
                        className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                          isSelected
                            ? 'border-primary shadow-lg scale-105'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="relative aspect-[3/4]">
                          <ImageWithRetry
                            src={model.image_url}
                            alt={model.name}
                            fill
                            className="object-cover"
                          />
                          
                          {/* Checkmark Overlay */}
                          {isSelected && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                              <div className="bg-primary rounded-full p-2">
                                <CheckCircle2 className="h-8 w-8 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="p-2 bg-card">
                          <p className="text-sm font-medium text-center truncate">
                            {model.name}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {processing && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <p className="font-medium mb-2">
                  جاري المعالجة... ({progress.current}/{progress.total})
                </p>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(progress.current / progress.total) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  قد تستغرق المعالجة عدة دقائق. لا تغلق الصفحة.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={processing || models.length === 0 || selectedModels.length === 0}
              className="bg-primary text-primary-foreground py-2 px-6 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {processing ? (
                <>
                  <Upload className="h-5 w-5 animate-spin" />
                  جاري المعالجة...
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  إضافة منتج
                </>
              )}
            </button>
          </form>
        </div>

        {/* Products Grid */}
        {loading ? (
          <p className="text-center text-muted-foreground">جاري التحميل...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-muted-foreground">
            لا توجد منتجات
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-card rounded-lg overflow-hidden shadow border border-border"
              >
                <div className="relative aspect-square">
                  <ImageWithRetry
                    src={product.original_image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-bold line-clamp-1">{product.name}</h3>
                  {product.price && (
                    <p className="text-primary font-bold">
                      {product.price.toLocaleString('ar-SY')} ل.س
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleVisibility(product.id, product.is_visible)}
                      className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                        product.is_visible
                          ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                          : 'bg-primary text-primary-foreground hover:bg-primary/90'
                      }`}
                    >
                      {product.is_visible ? (
                        <>
                          <EyeOff className="h-4 w-4" />
                          إخفاء
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" />
                          إظهار
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-destructive text-destructive-foreground px-3 rounded-lg hover:bg-destructive/90 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}