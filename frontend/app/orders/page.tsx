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
    Placed: 'bg-yellow-100 text-yellow-700',
    Confirmed: 'bg-blue-100 text-blue-700',
    Shipped: 'bg-purple-100 text-purple-700',
    Delivered: 'bg-green-100 text-green-700',
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">VendorHub</h1>
        <div className="flex gap-4">
          <a href="/products" className="text-sm text-gray-600 hover:text-blue-600">Products</a>
          <a href="/dashboard" className="text-sm text-gray-600 hover:text-blue-600">Dashboard</a>
        </div>
      </nav>

      <div className="p-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">My Orders</h2>

        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">No orders yet</p>
            <a href="/products" className="text-blue-600 hover:underline mt-2 block">Start Shopping</a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Order ID: {order._id}</p>
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[order.status]}`}>
                    {order.status}
                  </span>
                </div>

                {/* Order Progress */}
                <div className="flex items-center justify-between mb-4">
                  {['Placed', 'Confirmed', 'Shipped', 'Delivered'].map((step, i) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                        ${['Placed', 'Confirmed', 'Shipped', 'Delivered'].indexOf(order.status) >= i
                          ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                        {i + 1}
                      </div>
                      <span className="text-xs ml-1 hidden md:block">{step}</span>
                      {i < 3 && <div className={`h-1 w-8 mx-1 ${
                        ['Placed', 'Confirmed', 'Shipped', 'Delivered'].indexOf(order.status) > i
                          ? 'bg-blue-600' : 'bg-gray-200'}`} />}
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  {order.items.map((item: any) => (
                    <div key={item._id} className="flex justify-between py-1 text-sm">
                      <span>{item.product?.name} x{item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                    <span>Total</span>
                    <span className="text-blue-600">₹{order.totalAmount}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-3">📍 {order.address}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}