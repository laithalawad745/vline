'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Plus, Trash2, Upload, Eye, EyeOff } from 'lucide-react';
import { uploadImage, Product, Model } from '@/lib/supabase';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProduct.name || !newProduct.file) {
      alert('الرجاء إدخال اسم المنتج واختيار صورة');
      return;
    }

    if (models.length === 0) {
      alert('الرجاء إضافة موديلات أولاً في صفحة إدارة الموديلات');
      return;
    }

    setProcessing(true);
    setProgress({ current: 0, total: models.length });

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

      // 3. معالجة الصور مع كل موديل
      for (let i = 0; i < models.length; i++) {
        const model = models[i];
        setProgress({ current: i + 1, total: models.length });

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

          <form onSubmit={handleSubmit} className="space-y-4">
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
              disabled={processing || models.length === 0}
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
                  <Image
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