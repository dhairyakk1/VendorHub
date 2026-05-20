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
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    router.push('/');
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-extrabold text-blue-600">VendorHub</h1>
        <div className="flex items-center gap-4">
          <a href="/products" className="text-sm text-gray-600 hover:text-blue-600">Products</a>
          {user.role === 'buyer' && <a href="/orders" className="text-sm text-gray-600 hover:text-blue-600">My Orders</a>}
          {user.role === 'buyer' && <a href="/cart" className="text-sm text-gray-600 hover:text-blue-600">🛒 Cart</a>}
          {user.role === 'seller' && <a href="/seller-dashboard" className="text-sm text-gray-600 hover:text-blue-600">My Products</a>}
          {user.role === 'seller' && <a href="/seller-orders" className="text-sm text-gray-600 hover:text-blue-600">Orders</a>}
          {user.role === 'admin' && <a href="/admin" className="text-sm text-gray-600 hover:text-blue-600">Admin Panel</a>}
          <button onClick={handleLogout}
            className="text-sm bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600">
            Logout
          </button>
        </div>
      </nav>

      <div className="p-8 max-w-5xl mx-auto">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-1">Welcome back, {user.name}! 👋</h2>
          <p className="text-blue-100 capitalize">
            {user.role === 'seller' && !user.isApproved
              ? '⏳ Your seller account is pending admin approval'
              : `You are logged in as a ${user.role}`}
          </p>
        </div>

        {/* Buyer Stats */}
        {user.role === 'buyer' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { label: 'Total Orders', value: stats.orders || 0, icon: '📦', color: 'text-blue-600' },
                { label: 'Delivered', value: stats.delivered || 0, icon: '✅', color: 'text-green-600' },
                { label: 'Cart Items', value: JSON.parse(localStorage.getItem('cart') || '[]').length, icon: '🛒', color: 'text-purple-600' },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
                  <span className="text-4xl">{s.icon}</span>
                  <div>
                    <p className="text-gray-500 text-sm">{s.label}</p>
                    <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="/products" className="bg-blue-600 text-white rounded-2xl p-6 hover:bg-blue-700 transition block">
                <div className="text-3xl mb-2">🛍️</div>
                <h3 className="text-xl font-bold">Browse Products</h3>
                <p className="text-blue-100 text-sm mt-1">Discover local products near you</p>
              </a>
              <a href="/orders" className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition block">
                <div className="text-3xl mb-2">📋</div>
                <h3 className="text-xl font-bold text-gray-800">My Orders</h3>
                <p className="text-gray-500 text-sm mt-1">Track your current and past orders</p>
              </a>
            </div>
          </>
        )}

        {/* Seller Stats */}
        {user.role === 'seller' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { label: 'Total Products', value: stats.products || 0, icon: '📦', color: 'text-blue-600' },
                { label: 'Total Orders', value: stats.orders || 0, icon: '🧾', color: 'text-purple-600' },
                { label: 'Total Revenue', value: `₹${stats.revenue || 0}`, icon: '💰', color: 'text-green-600' },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
                  <span className="text-4xl">{s.icon}</span>
                  <div>
                    <p className="text-gray-500 text-sm">{s.label}</p>
                    <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="/seller-dashboard" className="bg-blue-600 text-white rounded-2xl p-6 hover:bg-blue-700 transition block">
                <div className="text-3xl mb-2">➕</div>
                <h3 className="text-xl font-bold">Manage Products</h3>
                <p className="text-blue-100 text-sm mt-1">Add, edit, or remove your listings</p>
              </a>
              <a href="/seller-orders" className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition block">
                <div className="text-3xl mb-2">🚚</div>
                <h3 className="text-xl font-bold text-gray-800">Manage Orders</h3>
                <p className="text-gray-500 text-sm mt-1">Confirm and ship incoming orders</p>
              </a>
            </div>
          </>
        )}

        {/* Admin Stats */}
        {user.role === 'admin' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { label: 'Total Sellers', value: stats.sellers || 0, icon: '🏪', color: 'text-blue-600' },
                { label: 'Pending Approvals', value: stats.pending || 0, icon: '⏳', color: 'text-yellow-600' },
                { label: 'Total Products', value: stats.products || 0, icon: '📦', color: 'text-green-600' },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
                  <span className="text-4xl">{s.icon}</span>
                  <div>
                    <p className="text-gray-500 text-sm">{s.label}</p>
                    <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="/admin" className="bg-blue-600 text-white rounded-2xl p-6 hover:bg-blue-700 transition block">
                <div className="text-3xl mb-2">✅</div>
                <h3 className="text-xl font-bold">Approve Sellers</h3>
                <p className="text-blue-100 text-sm mt-1">Review and approve vendor applications</p>
              </a>
              <a href="/products" className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition block">
                <div className="text-3xl mb-2">🛍️</div>
                <h3 className="text-xl font-bold text-gray-800">View Products</h3>
                <p className="text-gray-500 text-sm mt-1">Browse all products on the platform</p>
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}