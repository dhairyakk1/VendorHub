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
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) setCart(JSON.parse(stored));
    const u = localStorage.getItem('user');
    if (!u) { router.push('/login'); return; }
    setUser(JSON.parse(u));
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
    <div className="min-h-screen bg-gray-100">
      <Toaster />
      <nav className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">VendorHub</h1>
        <a href="/cart" className="text-sm text-gray-600 hover:text-blue-600">← Back to Cart</a>
      </nav>

      <div className="p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Checkout</h2>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
          {cart.map((item) => (
            <div key={item._id} className="flex justify-between py-2 border-b last:border-0">
              <span>{item.name} x{item.quantity}</span>
              <span className="font-semibold">₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between mt-4 text-lg font-bold">
            <span>Total</span>
            <span className="text-blue-600">₹{total}</span>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h3 className="font-semibold text-lg mb-4">Delivery Address</h3>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your full delivery address..."
            className="w-full border rounded-lg px-4 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Payment (Sandbox) */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h3 className="font-semibold text-lg mb-4">Payment</h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm">
            ✅ Sandbox Mode — No real payment will be charged
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Card Number</label>
              <input defaultValue="4242 4242 4242 4242"
                className="w-full border rounded-lg px-4 py-2 bg-gray-50" readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expiry</label>
              <input defaultValue="12/26"
                className="w-full border rounded-lg px-4 py-2 bg-gray-50" readOnly />
            </div>
          </div>
        </div>

        <button
          onClick={handleOrder}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold text-lg"
        >
          {loading ? 'Placing Order...' : `Place Order — ₹${total}`}
        </button>
      </div>
    </div>
  );
}