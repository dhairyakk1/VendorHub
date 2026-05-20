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

      // Setup Fuse.js for fuzzy search
      fuseRef.current = new Fuse(res.data, {
        keys: ['name', 'description', 'category'],
        threshold: 0.4, // 0 = exact, 1 = anything
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
    } catch (err) {
      // Not logged in or buyer - skip
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchRecommendations();
  }, []);

  // Live fuzzy search as user types
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
    if (exists) {
      exists.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to cart!');
  };

  const ProductCard = ({ product }: { product: any }) => (
    <div
      onClick={() => router.push(`/products/${product._id}`)}
      className="bg-white rounded-xl shadow hover:shadow-md cursor-pointer transition"
    >
      <div className="bg-gray-200 h-48 rounded-t-xl flex items-center justify-center">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name}
            className="h-full w-full object-cover rounded-t-xl" />
        ) : (
          <span className="text-gray-400 text-sm">No image</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{product.category}</p>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-yellow-400 text-sm">{'★'.repeat(Math.round(product.rating || 0))}{'☆'.repeat(5 - Math.round(product.rating || 0))}</span>
          <span className="text-xs text-gray-400">({product.numReviews || 0})</span>
        </div>
        <p className="text-blue-600 font-bold mt-2">₹{product.price}</p>
        <p className="text-xs text-gray-400 mt-1">by {product.seller?.name}</p>
        <button
          onClick={(e) => addToCart(e, product)}
          className="mt-2 w-full bg-blue-600 text-white py-1 rounded-lg text-sm hover:bg-blue-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">VendorHub</h1>
        <div className="flex gap-4">
          <a href="/dashboard" className="text-sm text-gray-600 hover:text-blue-600">Dashboard</a>
          <a href="/orders" className="text-sm text-gray-600 hover:text-blue-600">My Orders</a>
          <a href="/cart" className="text-sm text-gray-600 hover:text-blue-600">🛒 Cart</a>
        </div>
      </nav>

      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Browse Products</h2>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search products... (try 'laptop bag' or 'phone cover')"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
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
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">⭐ Recommended for You</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recommended.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* All Products */}
        <h3 className="text-lg font-semibold mb-3">
          {search ? `Search results for "${search}"` : 'All Products'}
          <span className="text-sm font-normal text-gray-500 ml-2">({filtered.length} found)</span>
        </h3>

        {loading ? (
          <p>Loading products...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">No products found</p>
            <p className="text-sm mt-2">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}