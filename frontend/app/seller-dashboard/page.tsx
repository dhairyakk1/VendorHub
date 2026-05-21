'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '../../lib/api';
import toast, { Toaster } from 'react-hot-toast';

export default function SellerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', category: '', images: '' });

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { router.push('/login'); return; }
    const u = JSON.parse(stored);
    if (u.role !== 'seller' && u.role !== 'admin') { router.push('/dashboard'); return; }
    setUser(u);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products');
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/products', {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: form.images ? [form.images] : [],
      });
      toast.success('Product added!');
      setShowForm(false);
      setForm({ name: '', description: '', price: '', stock: '', category: '', images: '' });
      fetchProducts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  if (!user) return <div className="min-h-screen bg-[#0f1117] flex items-center justify-center text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-100">
      <Toaster />
      <nav className="border-b border-gray-800 px-8 py-4 flex justify-between items-center sticky top-0 bg-[#0f1117]/90 backdrop-blur z-50">
        <h1 className="text-xl font-bold text-white">Vendor<span className="text-blue-500">Hub</span></h1>
        <div className="flex gap-6 items-center">
          <a href="/seller-orders" className="text-sm text-gray-400 hover:text-white transition">Orders</a>
          <a href="/dashboard" className="text-sm text-gray-400 hover:text-white transition">Dashboard</a>
          <span className="text-sm text-gray-600">Hi, {user.name}</span>
        </div>
      </nav>

      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">My Products</h2>
            <p className="text-gray-400 text-sm mt-1">{products.length} products listed</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className={`text-sm font-semibold px-5 py-2.5 rounded-xl transition ${showForm ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}>
            {showForm ? 'Cancel' : '+ Add Product'}
          </button>
        </div>

        {/* Add Product Form */}
        {showForm && (
          <div className="bg-[#1a1d27] border border-gray-800 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-5">New Product</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'name', label: 'Product Name', placeholder: 'e.g. Wireless Earbuds', type: 'text' },
                { name: 'images', label: 'Image URL', placeholder: 'https://...', type: 'text' },
                { name: 'price', label: 'Price (₹)', placeholder: '499', type: 'number' },
                { name: 'stock', label: 'Stock', placeholder: '50', type: 'number' },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">{field.label}</label>
                  <input name={field.name} type={field.type}
                    value={(form as any)[field.name]} onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full bg-[#0f1117] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition text-sm"
                    required={field.name !== 'images'} />
                </div>
              ))}
              <div>
                <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">Category</label>
                <select name="category" value={form.category} onChange={handleChange}
                  className="w-full bg-[#0f1117] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition text-sm" required>
                  <option value="">Select category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Food">Food</option>
                  <option value="Books">Books</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  placeholder="Describe your product..."
                  className="w-full bg-[#0f1117] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition text-sm resize-none h-[46px]"
                  required />
              </div>
              <div className="md:col-span-2">
                <button type="submit" disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50">
                  {loading ? 'Adding...' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Table */}
        {products.length === 0 ? (
          <div className="text-center py-24 bg-[#1a1d27] border border-gray-800 rounded-2xl">
            <p className="text-4xl mb-4">📦</p>
            <p className="text-gray-300 font-semibold">No products yet</p>
            <p className="text-gray-600 text-sm mt-1">Add your first product to get started</p>
          </div>
        ) : (
          <div className="bg-[#1a1d27] border border-gray-800 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p._id} className={`border-b border-gray-800 last:border-0 hover:bg-[#0f1117]/50 transition ${i % 2 === 0 ? '' : 'bg-[#0f1117]/20'}`}>
                    <td className="px-6 py-4 font-medium text-white">{p.name}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded-full">{p.category}</span>
                    </td>
                    <td className="px-6 py-4 text-blue-400 font-semibold">₹{p.price}</td>
                    <td className="px-6 py-4">
                      {p.stock < 5 ? (
                        <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded-full">⚠️ {p.stock} left</span>
                      ) : (
                        <span className="text-gray-300">{p.stock}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleDelete(p._id)}
                        className="text-xs text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-400/40 px-3 py-1 rounded-lg transition">
                        Delete
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
  );
}