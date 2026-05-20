'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(stored));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">VendorHub</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Hi, {user.name}</span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full capitalize">{user.role}</span>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="p-8">
        {user.role === 'buyer' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Buyer Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-xl shadow text-center">
                <p className="text-gray-500 text-sm">My Orders</p>
                <p className="text-3xl font-bold mt-2">0</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow text-center">
                <p className="text-gray-500 text-sm">Wishlist Items</p>
                <p className="text-3xl font-bold mt-2">0</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow text-center">
                <p className="text-gray-500 text-sm">Reviews Given</p>
                <p className="text-3xl font-bold mt-2">0</p>
              </div>
            </div>
          </div>
        )}

        {user.role === 'seller' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Seller Dashboard</h2>
            {!user.isApproved ? (
              <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-6 py-4 rounded-xl">
                ⏳ Your seller account is pending admin approval. You'll be notified once approved.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-xl shadow text-center">
                  <p className="text-gray-500 text-sm">Total Products</p>
                  <p className="text-3xl font-bold mt-2">0</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow text-center">
                  <p className="text-gray-500 text-sm">Orders This Week</p>
                  <p className="text-3xl font-bold mt-2">0</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow text-center">
                  <p className="text-gray-500 text-sm">Total Revenue</p>
                  <p className="text-3xl font-bold mt-2">₹0</p>
                </div>
              </div>
            )}
          </div>
        )}

        {user.role === 'admin' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-xl shadow text-center">
                <p className="text-gray-500 text-sm">Total Users</p>
                <p className="text-3xl font-bold mt-2">0</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow text-center">
                <p className="text-gray-500 text-sm">Pending Vendors</p>
                <p className="text-3xl font-bold mt-2">0</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow text-center">
                <p className="text-gray-500 text-sm">Total Sales</p>
                <p className="text-3xl font-bold mt-2">₹0</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}