'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '../../lib/api';
import toast, { Toaster } from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) setCart(JSON.parse(stored));
    const u = localStorage.getItem('user');
    if (!u) { router.push('/login'); return; }
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrder = async () => {
    if (!address.trim()) { toast.error('Please enter a delivery address'); return; }
    if (cart.length === 0) { toast.error('Your cart is empty'); return; }
    setLoading(true);
    try {
      await API.post('/orders', {
        items: cart.map((item) => ({ productId: item._id, quantity: item.quantity })),
        address,
      });
      localStorage.removeItem('cart');
      toast.success('Order placed successfully!');
      setTimeout(() => router.push('/orders'), 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-100">
      <Toaster />
      <nav className="border-b border-gray-800 px-8 py-4 flex justify-between items-center sticky top-0 bg-[#0f1117]/90 backdrop-blur z-50">
        <h1 className="text-xl font-bold text-white">Vendor<span className="text-blue-500">Hub</span></h1>
        <a href="/cart" className="text-sm text-gray-400 hover:text-white transition">← Back to Cart</a>
      </nav>

      <div className="p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6">Checkout</h2>

        {/* Order Summary */}
        <div className="bg-[#1a1d27] border border-gray-800 rounded-2xl p-6 mb-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Order Summary</h3>
          {cart.map((item) => (
            <div key={item._id} className="flex justify-between py-2 border-b border-gray-800 last:border-0 text-sm">
              <span className="text-gray-300">{item.name} <span className="text-gray-500">x{item.quantity}</span></span>
              <span className="text-white font-medium">₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between mt-4 pt-4 border-t border-gray-700">
            <span className="text-gray-400">Total</span>
            <span className="text-xl font-bold text-blue-400">₹{total}</span>
          </div>
        </div>

        {/* Address */}
        <div className="bg-[#1a1d27] border border-gray-800 rounded-2xl p-6 mb-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Delivery Address</h3>
          <textarea value={address} onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your full delivery address..."
            className="w-full bg-[#0f1117] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition h-24 text-sm resize-none" />
        </div>

        {/* Payment */}
        <div className="bg-[#1a1d27] border border-gray-800 rounded-2xl p-6 mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Payment</h3>
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-green-400 text-sm mb-4">
            ✅ Sandbox Mode — No real payment will be charged
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-2">Card Number</label>
              <input defaultValue="4242 4242 4242 4242" readOnly
                className="w-full bg-[#0f1117] border border-gray-700 rounded-xl px-4 py-3 text-gray-400 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2">Expiry</label>
              <input defaultValue="12/26" readOnly
                className="w-full bg-[#0f1117] border border-gray-700 rounded-xl px-4 py-3 text-gray-400 text-sm" />
            </div>
          </div>
        </div>

        <button onClick={handleOrder} disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-xl transition disabled:opacity-50 text-lg">
          {loading ? 'Placing Order...' : `Place Order — ₹${total}`}
        </button>
      </div>
    </div>
  );
}