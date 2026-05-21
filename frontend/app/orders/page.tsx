'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '../../lib/api';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (!u) { router.push('/login'); return; }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders/my-orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statusColor: any = {
    Placed: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    Confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    Delivered: 'bg-green-500/10 text-green-400 border-green-500/20',
  };

  const steps = ['Placed', 'Confirmed', 'Shipped', 'Delivered'];

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-100">
      <nav className="border-b border-gray-800 px-8 py-4 flex justify-between items-center sticky top-0 bg-[#0f1117]/90 backdrop-blur z-50">
        <h1 className="text-xl font-bold text-white">Vendor<span className="text-blue-500">Hub</span></h1>
        <div className="flex gap-6">
          <a href="/products" className="text-sm text-gray-400 hover:text-white transition">Products</a>
          <a href="/dashboard" className="text-sm text-gray-400 hover:text-white transition">Dashboard</a>
        </div>
      </nav>

      <div className="p-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6">My Orders</h2>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 bg-[#1a1d27] border border-gray-800 rounded-2xl">
            <p className="text-4xl mb-4">📦</p>
            <p className="text-gray-300 text-lg font-semibold">No orders yet</p>
            <a href="/products" className="text-blue-400 hover:text-blue-300 text-sm mt-2 block">Start Shopping →</a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-[#1a1d27] border border-gray-800 rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs text-gray-600 font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusColor[order.status]}`}>
                    {order.status}
                  </span>
                </div>

                {/* Progress */}
                <div className="flex items-center mb-5">
                  {steps.map((step, i) => {
                    const current = steps.indexOf(order.status);
                    const done = i <= current;
                    return (
                      <div key={step} className="flex items-center flex-1 last:flex-none">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${done ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-600'}`}>
                          {i < current ? '✓' : i + 1}
                        </div>
                        <p className={`text-xs ml-1 hidden md:block ${done ? 'text-blue-400' : 'text-gray-600'}`}>{step}</p>
                        {i < steps.length - 1 && (
                          <div className={`flex-1 h-px mx-2 ${i < current ? 'bg-blue-600' : 'bg-gray-800'}`} />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Items */}
                <div className="border-t border-gray-800 pt-4">
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

                <p className="text-xs text-gray-600 mt-3">📍 {order.address}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}