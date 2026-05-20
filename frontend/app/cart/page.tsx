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
    <div className="min-h-screen bg-gray-100">
      <Toaster />
      <nav className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">VendorHub</h1>
        <div className="flex gap-4">
          <a href="/products" className="text-sm text-gray-600 hover:text-blue-600">Products</a>
          <a href="/dashboard" className="text-sm text-gray-600 hover:text-blue-600">Dashboard</a>
        </div>
      </nav>

      <div className="p-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">My Cart</h2>

        {cart.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">Your cart is empty</p>
            <a href="/products" className="text-blue-600 hover:underline mt-2 block">Browse Products</a>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item._id} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
                  <div className="bg-gray-200 h-16 w-16 rounded-lg flex items-center justify-center flex-shrink-0">
                    {item.images?.[0] ? (
                      <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover rounded-lg" />
                    ) : (
                      <span className="text-gray-400 text-xs">No img</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-blue-600 font-bold">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="bg-gray-200 px-2 py-1 rounded">-</button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="bg-gray-200 px-2 py-1 rounded">+</button>
                  </div>
                  <p className="font-bold w-20 text-right">₹{item.price * item.quantity}</p>
                  <button onClick={() => removeItem(item._id)}
                    className="text-red-500 hover:text-red-700 ml-2">✕</button>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold text-blue-600">₹{total}</span>
              </div>
              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}