'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  Users, 
  Settings, 
  LogOut,
  TrendingUp,
  Image as ImageIcon 
} from 'lucide-react';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    products: 0,
    models: 0,
    processedImages: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadStats();
    }
  }, []);

  const loadStats = async () => {
    try {
      const [productsRes, modelsRes, processedRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/models'),
        fetch('/api/processed-images'),
      ]);

      const products = await productsRes.json();
      const models = await modelsRes.json();
      const processed = await processedRes.json();

      setStats({
        products: products.length,
        models: models.length,
        processedImages: processed.length,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'admin123') {
      sessionStorage.setItem('admin_auth', 'true');
      setIsAuthenticated(true);
      setError('');
      loadStats();
    } else {
      setError('كلمة السر غير صحيحة');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-card p-8 rounded-lg shadow-lg border border-border max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">
            تسجيل الدخول - لوحة التحكم
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                كلمة السر
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="أدخل كلمة السر"
              />
            </div>
            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              دخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">لوحة التحكم - L Vline</h1>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                عرض الموقع
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-destructive hover:text-destructive/80 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                خروج
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card p-6 rounded-lg shadow border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">
                  عدد المنتجات
                </p>
                <p className="text-3xl font-bold">{stats.products}</p>
              </div>
              <Package className="h-12 w-12 text-primary opacity-20" />
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg shadow border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">
                  عدد الموديلات
                </p>
                <p className="text-3xl font-bold">{stats.models}</p>
              </div>
              <Users className="h-12 w-12 text-primary opacity-20" />
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg shadow border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">
                  الصور المعالجة
                </p>
                <p className="text-3xl font-bold">{stats.processedImages}</p>
              </div>
              <ImageIcon className="h-12 w-12 text-primary opacity-20" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/products"
            className="bg-card p-8 rounded-lg shadow border border-border hover:shadow-lg transition-all group"
          >
            <Package className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-bold mb-2">إدارة المنتجات</h2>
            <p className="text-muted-foreground">
              إضافة، تعديل، وحذف المنتجات
            </p>
          </Link>

          <Link
            href="/admin/models"
            className="bg-card p-8 rounded-lg shadow border border-border hover:shadow-lg transition-all group"
          >
            <Users className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-bold mb-2">إدارة الموديلات</h2>
            <p className="text-muted-foreground">
              إضافة وإدارة صور الموديلات
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}