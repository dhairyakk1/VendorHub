'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '../../lib/api';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sellers, setSellers] = useState<any[]>([]);

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
    } catch (err) { console.error(err); }
  };

  const handleApprove = async (id: string) => {
    try {
      await API.put(`/admin/sellers/${id}/approve`);
      toast.success('Seller approved!');
      fetchSellers();
    } catch { toast.error('Failed to approve seller'); }
  };

  const handleReject = async (id: string) => {
    try {
      await API.delete(`/admin/sellers/${id}`);
      toast.success('Seller rejected');
      fetchSellers();
    } catch { toast.error('Failed to reject seller'); }
  };

  const pending = sellers.filter((s) => !s.isApproved);
  const approved = sellers.filter((s) => s.isApproved);

  if (!user) return <div className="min-h-screen bg-[#0f1117] flex items-center justify-center text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-100">
      <Toaster />
      <nav className="border-b border-gray-800 px-8 py-4 flex justify-between items-center sticky top-0 bg-[#0f1117]/90 backdrop-blur z-50">
        <h1 className="text-xl font-bold text-white">Vendor<span className="text-blue-500">Hub</span></h1>
        <div className="flex gap-6 items-center">
          <a href="/products" className="text-sm text-gray-400 hover:text-white transition">Products</a>
          <a href="/dashboard" className="text-sm text-gray-400 hover:text-white transition">Dashboard</a>
          <span className="text-sm text-gray-600">Hi, {user.name}</span>
        </div>
      </nav>

      <div className="p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
          <p className="text-gray-400 text-sm mt-1">Manage vendors and platform settings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Sellers', value: sellers.length, icon: '🏪' },
            { label: 'Pending Approvals', value: pending.length, icon: '⏳', highlight: pending.length > 0 },
            { label: 'Approved Sellers', value: approved.length, icon: '✅' },
          ].map((s) => (
            <div key={s.label} className={`bg-[#1a1d27] border rounded-2xl p-6 flex items-center gap-4 ${s.highlight ? 'border-yellow-500/30' : 'border-gray-800'}`}>
              <span className="text-3xl">{s.icon}</span>
              <div>
                <p className="text-gray-400 text-xs">{s.label}</p>
                <p className={`text-2xl font-bold mt-0.5 ${s.highlight ? 'text-yellow-400' : 'text-white'}`}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pending */}
        {pending.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">⏳ Pending Approvals</h3>
            <div className="bg-[#1a1d27] border border-yellow-500/20 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((seller) => (
                    <tr key={seller._id} className="border-b border-gray-800 last:border-0 hover:bg-[#0f1117]/50 transition">
                      <td className="px-6 py-4 font-medium text-white">{seller.name}</td>
                      <td className="px-6 py-4 text-gray-400">{seller.email}</td>
                      <td className="px-6 py-4 flex gap-2">
                        <button onClick={() => handleApprove(seller._id)}
                          className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 px-3 py-1.5 rounded-lg transition font-medium">
                          ✓ Approve
                        </button>
                        <button onClick={() => handleReject(seller._id)}
                          className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition font-medium">
                          ✕ Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Approved */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">✅ Approved Sellers</h3>
          {approved.length === 0 ? (
            <div className="text-center py-12 bg-[#1a1d27] border border-gray-800 rounded-2xl text-gray-600 text-sm">
              No approved sellers yet
            </div>
          ) : (
            <div className="bg-[#1a1d27] border border-gray-800 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {approved.map((seller) => (
                    <tr key={seller._id} className="border-b border-gray-800 last:border-0 hover:bg-[#0f1117]/50 transition">
                      <td className="px-6 py-4 font-medium text-white">{seller.name}</td>
                      <td className="px-6 py-4 text-gray-400">{seller.email}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-1 rounded-full">Approved</span>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleReject(seller._id)}
                          className="text-xs text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-400/40 px-3 py-1.5 rounded-lg transition">
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}