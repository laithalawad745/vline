'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseAuth } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabaseAuth.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // التحقق من أن المستخدم أدمن
      const { data: profile } = await supabaseAuth
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profile?.role !== 'admin') {
        await supabaseAuth.auth.signOut();
        throw new Error('غير مصرح لك بالدخول');
      }

      router.push('/admin');
    } catch (error: any) {
      setError(error.message || 'حدث خطأ في تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#131022]">
      <div className="bg-[#1a162e] p-8 rounded-2xl shadow-2xl border border-white/10 max-w-md w-full">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          تسجيل الدخول - لوحة التحكم
        </h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#131022] text-white focus:outline-none focus:ring-2 focus:ring-[#3713ec]"
              placeholder="admin@vline.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#131022] text-white focus:outline-none focus:ring-2 focus:ring-[#3713ec]"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3713ec] text-white py-3 rounded-xl font-bold hover:bg-[#3713ec]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                جاري تسجيل الدخول...
              </>
            ) : (
              'دخول'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}