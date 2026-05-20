'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '../../lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { router.push('/login'); return; }
    const u = JSON.parse(stored);
    setUser(u);
    fetchStats(u);
  }, []);

  const fetchStats = async (u: any) => {
    try {
      if (u.role === 'buyer') {
        const res = await API.get('/orders/my-orders');
        setStats({ orders: res.data.length, delivered: res.data.filter((o: any) => o.status === 'Delivered').length });
      } else if (u.role === 'seller') {
        const res = await API.get('/orders/seller-orders');
        const products = await API.get('/products');
        const revenue = res.data.reduce((sum: number, o: any) => sum + o.totalAmount, 0);
        setStats({ orders: res.data.length, revenue, products: products.data.length });
      } else if (u.role === 'admin') {
        const sellers = await API.get('/admin/sellers');
        const products = await API.get('/products');
        setStats({ sellers: sellers.data.length, pending: sellers.data.filter((s: any) => !s.isApproved).length, products: products.data.length });
      }
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <a href={href} className="text-sm text-gray-400 hover:text-white transition">{label}</a>
  );

  if (!user) return <div className="min-h-screen bg-[#0f1117] flex items-center justify-center text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-100">
      <nav className="border-b border-gray-800 px-8 py-4 flex justify-between items-center sticky top-0 bg-[#0f1117]/90 backdrop-blur z-50">
        <h1 className="text-xl font-bold text-white">Vendor<span className="text-blue-500">Hub</span></h1>
        <div className="flex items-center gap-6">
          <NavLink href="/products" label="Products" />
          {user.role === 'buyer' && <NavLink href="/orders" label="My Orders" />}
          {user.role === 'buyer' && <NavLink href="/cart" label="🛒 Cart" />}
          {user.role === 'seller' && <NavLink href="/seller-dashboard" label="My Products" />}
          {user.role === 'seller' && <NavLink href="/seller-orders" label="Orders" />}
          {user.role === 'admin' && <NavLink href="/admin" label="Admin Panel" />}
          <button onClick={handleLogout}
            className="text-sm border border-gray-700 hover:border-red-500 text-gray-400 hover:text-red-400 px-4 py-1.5 rounded-lg transition">
            Logout
          </button>
        </div>
      </nav>

      <div className="p-8 max-w-5xl mx-auto">
        {/* Welcome */}
        <div className="bg-[#1a1d27] border border-gray-800 rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1 capitalize">{user.role} account</p>
              <h2 className="text-3xl font-bold text-white">Welcome back, {user.name} 👋</h2>
              {user.role === 'seller' && !user.isApproved && (
                <div className="mt-3 inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm px-4 py-2 rounded-lg">
                  ⏳ Your seller account is pending admin approval
                </div>
              )}
            </div>
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold text-white">
              {user.name[0].toUpperCase()}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {user.role === 'buyer' && [
            { label: 'Total Orders', value: stats.orders || 0, icon: '📦' },
            { label: 'Delivered', value: stats.delivered || 0, icon: '✅' },
            { label: 'Cart Items', value: JSON.parse(localStorage.getItem('cart') || '[]').length, icon: '🛒' },
          ].map((s) => (
            <div key={s.label} className="bg-[#1a1d27] border border-gray-800 rounded-2xl p-6 flex items-center gap-4">
              <span className="text-3xl">{s.icon}</span>
              <div>
                <p className="text-gray-400 text-xs">{s.label}</p>
                <p className="text-2xl font-bold text-white mt-0.5">{s.value}</p>
              </div>
            </div>
          ))}
          {user.role === 'seller' && [
            { label: 'Total Products', value: stats.products || 0, icon: '📦' },
            { label: 'Total Orders', value: stats.orders || 0, icon: '🧾' },
            { label: 'Revenue', value: `₹${stats.revenue || 0}`, icon: '💰' },
          ].map((s) => (
            <div key={s.label} className="bg-[#1a1d27] border border-gray-800 rounded-2xl p-6 flex items-center gap-4">
              <span className="text-3xl">{s.icon}</span>
              <div>
                <p className="text-gray-400 text-xs">{s.label}</p>
                <p className="text-2xl font-bold text-white mt-0.5">{s.value}</p>
              </div>
            </div>
          ))}
          {user.role === 'admin' && [
            { label: 'Total Sellers', value: stats.sellers || 0, icon: '🏪' },
            { label: 'Pending Approvals', value: stats.pending || 0, icon: '⏳' },
            { label: 'Total Products', value: stats.products || 0, icon: '📦' },
          ].map((s) => (
            <div key={s.label} className="bg-[#1a1d27] border border-gray-800 rounded-2xl p-6 flex items-center gap-4">
              <span className="text-3xl">{s.icon}</span>
              <div>
                <p className="text-gray-400 text-xs">{s.label}</p>
                <p className="text-2xl font-bold text-white mt-0.5">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.role === 'buyer' && <>
            <a href="/products" className="bg-blue-600 hover:bg-blue-500 rounded-2xl p-6 transition block">
              <div className="text-2xl mb-2">🛍️</div>
              <h3 className="text-lg font-semibold text-white">Browse Products</h3>
              <p className="text-blue-200 text-sm mt-1">Discover local products near you</p>
            </a>
            <a href="/orders" className="bg-[#1a1d27] border border-gray-800 hover:border-gray-600 rounded-2xl p-6 transition block">
              <div className="text-2xl mb-2">📋</div>
              <h3 className="text-lg font-semibold text-white">My Orders</h3>
              <p className="text-gray-400 text-sm mt-1">Track your current and past orders</p>
            </a>
          </>}
          {user.role === 'seller' && <>
            <a href="/seller-dashboard" className="bg-blue-600 hover:bg-blue-500 rounded-2xl p-6 transition block">
              <div className="text-2xl mb-2">➕</div>
              <h3 className="text-lg font-semibold text-white">Manage Products</h3>
              <p className="text-blue-200 text-sm mt-1">Add, edit, or remove your listings</p>
            </a>
            <a href="/seller-orders" className="bg-[#1a1d27] border border-gray-800 hover:border-gray-600 rounded-2xl p-6 transition block">
              <div className="text-2xl mb-2">🚚</div>
              <h3 className="text-lg font-semibold text-white">Manage Orders</h3>
              <p className="text-gray-400 text-sm mt-1">Confirm and ship incoming orders</p>
            </a>
          </>}
          {user.role === 'admin' && <>
            <a href="/admin" className="bg-blue-600 hover:bg-blue-500 rounded-2xl p-6 transition block">
              <div className="text-2xl mb-2">✅</div>
              <h3 className="text-lg font-semibold text-white">Approve Sellers</h3>
              <p className="text-blue-200 text-sm mt-1">Review and approve vendor applications</p>
            </a>
            <a href="/products" className="bg-[#1a1d27] border border-gray-800 hover:border-gray-600 rounded-2xl p-6 transition block">
              <div className="text-2xl mb-2">🛍️</div>
              <h3 className="text-lg font-semibold text-white">View Products</h3>
              <p className="text-gray-400 text-sm mt-1">Browse all products on the platform</p>
            </a>
          </>}
        </div>
      </div>
    </div>
  );
}