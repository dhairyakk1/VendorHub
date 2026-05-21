'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) setCart(JSON.parse(stored));
  }, []);

  const updateCart = (updated: any[]) => {
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const removeItem = (id: string) => {
    updateCart(cart.filter((item) => item._id !== id));
    toast.success('Removed from cart');
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    updateCart(cart.map((item) => item._id === id ? { ...item, quantity } : item));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-100">
      <Toaster />
      <nav className="border-b border-gray-800 px-8 py-4 flex justify-between items-center sticky top-0 bg-[#0f1117]/90 backdrop-blur z-50">
        <h1 className="text-xl font-bold text-white">Vendor<span className="text-blue-500">Hub</span></h1>
        <div className="flex gap-6">
          <a href="/products" className="text-sm text-gray-400 hover:text-white transition">← Products</a>
          <a href="/dashboard" className="text-sm text-gray-400 hover:text-white transition">Dashboard</a>
        </div>
      </nav>

      <div className="p-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6">My Cart</h2>

        {cart.length === 0 ? (
          <div className="text-center py-24 bg-[#1a1d27] border border-gray-800 rounded-2xl">
            <p className="text-4xl mb-4">🛒</p>
            <p className="text-gray-300 text-lg font-semibold">Your cart is empty</p>
            <a href="/products" className="text-blue-400 hover:text-blue-300 text-sm mt-2 block">Browse Products →</a>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {cart.map((item) => (
                <div key={item._id} className="bg-[#1a1d27] border border-gray-800 rounded-2xl p-4 flex items-center gap-4">
                  <div className="bg-[#0f1117] h-16 w-16 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {item.images?.[0] ? (
                      <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover rounded-xl" />
                    ) : (
                      <span className="text-gray-600 text-xs">No img</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-sm">{item.name}</h3>
                    <p className="text-blue-400 font-bold text-sm">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="bg-[#0f1117] border border-gray-700 text-white w-8 h-8 rounded-lg hover:border-gray-500 transition text-sm">-</button>
                    <span className="w-8 text-center text-sm text-white">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="bg-[#0f1117] border border-gray-700 text-white w-8 h-8 rounded-lg hover:border-gray-500 transition text-sm">+</button>
                  </div>
                  <p className="font-bold text-white w-20 text-right text-sm">₹{item.price * item.quantity}</p>
                  <button onClick={() => removeItem(item._id)}
                    className="text-gray-600 hover:text-red-400 transition ml-2 text-lg">✕</button>
                </div>
              ))}
            </div>

            <div className="bg-[#1a1d27] border border-gray-800 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-400">Total Amount</span>
                <span className="text-2xl font-bold text-white">₹{total}</span>
              </div>
              <button onClick={() => router.push('/checkout')}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition">
                Proceed to Checkout →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}