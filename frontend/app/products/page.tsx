'use client';
import { useEffect, useState, useRef } from 'react';
import API from '../../lib/api';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const fuseRef = useRef<any>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get('/products');
      setProducts(res.data);
      setFiltered(res.data);
      fuseRef.current = new Fuse(res.data, {
        keys: ['name', 'description', 'category'],
        threshold: 0.4,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const res = await API.get('/recommendations');
      setRecommended(res.data.recommended);
    } catch (err) {}
  };

  useEffect(() => {
    fetchProducts();
    fetchRecommendations();
  }, []);

  useEffect(() => {
    let results = products;
    if (search && fuseRef.current) {
      results = fuseRef.current.search(search).map((r: any) => r.item);
    }
    if (category) {
      results = results.filter((p) => p.category === category);
    }
    setFiltered(results);
  }, [search, category, products]);

  const addToCart = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const exists = cart.find((i: any) => i._id === product._id);
    if (exists) exists.quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to cart!');
  };

  const ProductCard = ({ product }: { product: any }) => (
    <div onClick={() => router.push(`/products/${product._id}`)}
      className="bg-[#1a1d27] border border-gray-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition cursor-pointer group">
      <div className="bg-[#0f1117] h-44 flex items-center justify-center overflow-hidden">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition duration-300" />
        ) : (
          <span className="text-gray-600 text-sm">No image</span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-blue-400 font-medium mb-1">{product.category}</p>
        <h3 className="font-semibold text-white text-sm mb-1 truncate">{product.name}</h3>
        <div className="flex items-center gap-1 mb-2">
          <span className="text-yellow-400 text-xs">{'★'.repeat(Math.round(product.rating || 0))}{'☆'.repeat(5 - Math.round(product.rating || 0))}</span>
          <span className="text-xs text-gray-500">({product.numReviews || 0})</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-blue-400 font-bold">₹{product.price}</p>
          <p className="text-xs text-gray-500">by {product.seller?.name}</p>
        </div>
        <button onClick={(e) => addToCart(e, product)}
          className="mt-3 w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-xl text-sm font-medium transition">
          Add to Cart
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-100">
      <nav className="border-b border-gray-800 px-8 py-4 flex justify-between items-center sticky top-0 bg-[#0f1117]/90 backdrop-blur z-50">
        <h1 className="text-xl font-bold text-white">Vendor<span className="text-blue-500">Hub</span></h1>
        <div className="flex gap-6 items-center">
          <a href="/dashboard" className="text-sm text-gray-400 hover:text-white transition">Dashboard</a>
          <a href="/orders" className="text-sm text-gray-400 hover:text-white transition">My Orders</a>
          <a href="/cart" className="text-sm text-gray-400 hover:text-white transition">🛒 Cart</a>
        </div>
      </nav>

      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-1">Browse Products</h2>
          <p className="text-gray-400 text-sm">Discover products from local vendors</p>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-3 mb-8">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
            <input type="text" placeholder="Search products..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1a1d27] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition text-sm" />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="bg-[#1a1d27] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition text-sm">
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Food">Food</option>
            <option value="Books">Books</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Recommendations */}
        {recommended.length > 0 && !search && !category && (
          <div className="mb-10">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">⭐ Recommended for You</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recommended.map((product) => <ProductCard key={product._id} product={product} />)}
            </div>
          </div>
        )}

        {/* All Products */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            {search ? `Results for "${search}"` : 'All Products'}
          </h3>
          <span className="text-xs text-gray-600">{filtered.length} products</span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading products...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No products found</p>
            <p className="text-gray-600 text-sm mt-2">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((product) => <ProductCard key={product._id} product={product} />)}
          </div>
        )}
      </div>
    </div>
  );
}