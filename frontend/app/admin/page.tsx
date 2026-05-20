'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '../../lib/api';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sellers, setSellers] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, pendingSellers: 0 });

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { router.push('/login'); return; }
    const u = JSON.parse(stored);
    if (u.role !== 'admin') { router.push('/dashboard'); return; }
    setUser(u);
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const res = await API.get('/admin/sellers');
      setSellers(res.data);
      setStats({
        totalUsers: res.data.length,
        pendingSellers: res.data.filter((s: any) => !s.isApproved).length,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await API.put(`/admin/sellers/${id}/approve`);
      toast.success('Seller approved!');
      fetchSellers();
    } catch (err) {
      toast.error('Failed to approve seller');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await API.delete(`/admin/sellers/${id}`);
      toast.success('Seller rejected');
      fetchSellers();
    } catch (err) {
      toast.error('Failed to reject seller');
    }
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster />
      <nav className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">VendorHub Admin</h1>
        <div className="flex gap-4 items-center">
          <a href="/dashboard" className="text-sm text-gray-600 hover:text-blue-600">Dashboard</a>
          <a href="/products" className="text-sm text-gray-600 hover:text-blue-600">Products</a>
          <span className="text-sm text-gray-600">Hi, {user.name}</span>
        </div>
      </nav>

      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p className="text-gray-500 text-sm">Total Sellers</p>
            <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p className="text-gray-500 text-sm">Pending Approvals</p>
            <p className="text-3xl font-bold mt-2 text-yellow-500">{stats.pendingSellers}</p>
          </div>
        </div>

        {/* Sellers Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="font-semibold text-lg">Seller Applications</h3>
          </div>
          {sellers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No seller applications yet</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sellers.map((seller) => (
                  <tr key={seller._id} className="border-t">
                    <td className="px-6 py-4 font-medium">{seller.name}</td>
                    <td className="px-6 py-4 text-gray-500">{seller.email}</td>
                    <td className="px-6 py-4">
                      {seller.isApproved ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">Approved</span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      {!seller.isApproved && (
                        <button onClick={() => handleApprove(seller._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-600">
                          Approve
                        </button>
                      )}
                      <button onClick={() => handleReject(seller._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-600">
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}