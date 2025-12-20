'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabaseAuth } from '@/lib/supabase';
import { 
  Package, 
  Users, 
  LogOut,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    products: 0,
    models: 0,
    processedImages: 0,
  });
  const router = useRouter();

  useEffect(() => {
    checkUser();
    loadStats();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabaseAuth.auth.getSession();
    if (session) {
      setUser(session.user);
    }
    setLoading(false);
  };

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

  const handleLogout = async () => {
    await supabaseAuth.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#131022] flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-[#3713ec] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131022]">
      {/* Header */}
      <header className="bg-[#1a162e] border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">لوحة التحكم - Vline</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">{user?.email}</span>
              <Link
                href="/"
                className="text-gray-400 hover:text-white transition-colors"
              >
                عرض الموقع
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
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
          <div className="bg-[#1a162e] p-6 rounded-2xl shadow border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">
                  عدد المنتجات
                </p>
                <p className="text-3xl font-bold text-white">{stats.products}</p>
              </div>
              <Package className="h-12 w-12 text-[#3713ec] opacity-20" />
            </div>
          </div>

          <div className="bg-[#1a162e] p-6 rounded-2xl shadow border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">
                  عدد الموديلات
                </p>
                <p className="text-3xl font-bold text-white">{stats.models}</p>
              </div>
              <Users className="h-12 w-12 text-[#3713ec] opacity-20" />
            </div>
          </div>

          <div className="bg-[#1a162e] p-6 rounded-2xl shadow border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">
                  الصور المعالجة
                </p>
                <p className="text-3xl font-bold text-white">{stats.processedImages}</p>
              </div>
              <ImageIcon className="h-12 w-12 text-[#3713ec] opacity-20" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/products"
            className="bg-[#1a162e] p-8 rounded-2xl shadow border border-white/10 hover:border-[#3713ec]/50 transition-all group"
          >
            <Package className="h-12 w-12 text-[#3713ec] mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-bold text-white mb-2">إدارة المنتجات</h2>
            <p className="text-gray-400">
              إضافة، تعديل، وحذف المنتجات
            </p>
          </Link>

          <Link
            href="/admin/models"
            className="bg-[#1a162e] p-8 rounded-2xl shadow border border-white/10 hover:border-[#3713ec]/50 transition-all group"
          >
            <Users className="h-12 w-12 text-[#3713ec] mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-bold text-white mb-2">إدارة الموديلات</h2>
            <p className="text-gray-400">
              إضافة وإدارة صور الموديلات
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}