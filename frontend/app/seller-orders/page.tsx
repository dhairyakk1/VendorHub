'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '../../lib/api';
import toast, { Toaster } from 'react-hot-toast';

export default function SellerOrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { router.push('/login'); return; }
    const u = JSON.parse(stored);
    if (u.role !== 'seller' && u.role !== 'admin') { router.push('/dashboard'); return; }
    setUser(u);
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders/seller-orders');
      setOrders(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status });
      toast.success(`Order marked as ${status}`);
      fetchOrders();
    } catch { toast.error('Failed to update status'); }
  };

  const statusColor: any = {
    Placed: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    Confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    Delivered: 'bg-green-500/10 text-green-400 border-green-500/20',
  };

  const nextStatus: any = { Placed: 'Confirmed', Confirmed: 'Shipped', Shipped: 'Delivered' };

  if (!user) return <div className="min-h-screen bg-[#0f1117] flex items-center justify-center text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-100">
      <Toaster />
      <nav className="border-b border-gray-800 px-8 py-4 flex justify-between items-center sticky top-0 bg-[#0f1117]/90 backdrop-blur z-50">
        <h1 className="text-xl font-bold text-white">Vendor<span className="text-blue-500">Hub</span></h1>
        <div className="flex gap-6 items-center">
          <a href="/seller-dashboard" className="text-sm text-gray-400 hover:text-white transition">My Products</a>
          <a href="/dashboard" className="text-sm text-gray-400 hover:text-white transition">Dashboard</a>
        </div>
      </nav>

      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Incoming Orders</h2>
          <p className="text-gray-400 text-sm mt-1">{orders.length} total orders</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 bg-[#1a1d27] border border-gray-800 rounded-2xl">
            <p className="text-4xl mb-4">🧾</p>
            <p className="text-gray-300 font-semibold">No orders yet</p>
            <p className="text-gray-600 text-sm mt-1">Orders from buyers will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-[#1a1d27] border border-gray-800 rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs text-gray-600 font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-sm font-semibold text-white mt-1">{order.buyer?.name}</p>
                    <p className="text-xs text-gray-500">{order.buyer?.email}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusColor[order.status]}`}>
                      {order.status}
                    </span>
                    <p className="text-xs text-gray-600 mt-2">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="border-t border-gray-800 py-4">
                  {order.items.map((item: any) => (
                    <div key={item._id} className="flex justify-between py-1.5 text-sm">
                      <span className="text-gray-300">{item.product?.name} <span className="text-gray-600">x{item.quantity}</span></span>
                      <span className="text-white">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="flex justify-between mt-3 pt-3 border-t border-gray-800">
                    <span className="text-gray-400 text-sm">Total</span>
                    <span className="font-bold text-blue-400">₹{order.totalAmount}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 mb-4">📍 {order.address}</p>

                {nextStatus[order.status] ? (
                  <button onClick={() => updateStatus(order._id, nextStatus[order.status])}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition">
                    Mark as {nextStatus[order.status]} →
                  </button>
                ) : (
                  <span className="text-green-400 text-sm font-semibold">✅ Delivered</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}