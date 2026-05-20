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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status });
      toast.success(`Order marked as ${status}`);
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const statusColor: any = {
    Placed: 'bg-yellow-100 text-yellow-700',
    Confirmed: 'bg-blue-100 text-blue-700',
    Shipped: 'bg-purple-100 text-purple-700',
    Delivered: 'bg-green-100 text-green-700',
  };

  const nextStatus: any = {
    Placed: 'Confirmed',
    Confirmed: 'Shipped',
    Shipped: 'Delivered',
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster />
      <nav className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">VendorHub</h1>
        <div className="flex gap-4 items-center">
          <a href="/seller-dashboard" className="text-sm text-gray-600 hover:text-blue-600">My Products</a>
          <a href="/dashboard" className="text-sm text-gray-600 hover:text-blue-600">Dashboard</a>
          <span className="text-sm text-gray-600">Hi, {user.name}</span>
        </div>
      </nav>

      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Incoming Orders</h2>

        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">No orders yet</p>
            <p className="text-sm mt-2">Orders from buyers will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Order ID: {order._id}</p>
                    <p className="text-sm font-semibold mt-1">
                      Buyer: {order.buyer?.name} ({order.buyer?.email})
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[order.status]}`}>
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div className="border-t border-b py-3 mb-4">
                  {order.items.map((item: any) => (
                    <div key={item._id} className="flex justify-between py-1 text-sm">
                      <span>{item.product?.name} x{item.quantity}</span>
                      <span className="font-semibold">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                    <span>Total</span>
                    <span className="text-blue-600">₹{order.totalAmount}</span>
                  </div>
                </div>

                {/* Address */}
                <p className="text-xs text-gray-500 mb-4">📍 {order.address}</p>

                {/* Action Button */}
                {nextStatus[order.status] && (
                  <button
                    onClick={() => updateStatus(order._id, nextStatus[order.status])}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold"
                  >
                    Mark as {nextStatus[order.status]}
                  </button>
                )}
                {order.status === 'Delivered' && (
                  <span className="text-green-600 font-semibold text-sm">✅ Order Delivered</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}