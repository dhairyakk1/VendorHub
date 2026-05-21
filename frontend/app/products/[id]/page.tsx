'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import API from '../../../lib/api';
import toast, { Toaster } from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
    fetchProduct();
    fetchReviews();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/${id}`);
      setProduct(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchReviews = async () => {
    try {
      const res = await API.get(`/reviews/${id}`);
      setReviews(res.data);
    } catch (err) { console.error(err); }
  };

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const exists = cart.find((i: any) => i._id === product._id);
    if (exists) exists.quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('Added to cart!');
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post(`/reviews/${id}`, { rating, comment });
      toast.success('Review submitted!');
      setComment('');
      setRating(5);
      fetchReviews();
      fetchProduct();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false); }
  };

  if (!product) return <div className="min-h-screen bg-[#0f1117] flex items-center justify-center text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-100">
      <Toaster />
      <nav className="border-b border-gray-800 px-8 py-4 flex justify-between items-center sticky top-0 bg-[#0f1117]/90 backdrop-blur z-50">
        <h1 className="text-xl font-bold text-white">Vendor<span className="text-blue-500">Hub</span></h1>
        <div className="flex gap-6">
          <a href="/products" className="text-sm text-gray-400 hover:text-white transition">← Products</a>
          <a href="/cart" className="text-sm text-gray-400 hover:text-white transition">🛒 Cart</a>
        </div>
      </nav>

      <div className="p-8 max-w-5xl mx-auto">
        {/* Product Info */}
        <div className="bg-[#1a1d27] border border-gray-800 rounded-2xl p-8 mb-6 flex flex-col md:flex-row gap-8">
          <div className="bg-[#0f1117] h-64 w-full md:w-64 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
            {product.images?.[0] ? (
              <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover rounded-2xl" />
            ) : (
              <span className="text-gray-600 text-sm">No image</span>
            )}
          </div>
          <div className="flex-1">
            <p className="text-xs text-blue-400 font-medium mb-2">{product.category}</p>
            <h2 className="text-3xl font-bold text-white mb-3">{product.name}</h2>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-400">{'★'.repeat(Math.round(product.rating || 0))}{'☆'.repeat(5 - Math.round(product.rating || 0))}</span>
              <span className="text-sm text-gray-500">({product.numReviews || 0} reviews)</span>
            </div>
            <p className="text-4xl font-bold text-blue-400 mb-4">₹{product.price}</p>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">{product.description}</p>
            <p className="text-sm text-gray-500 mb-2">Sold by <span className="text-white font-medium">{product.seller?.name}</span></p>
            <p className={`text-sm mb-6 ${product.stock < 5 ? 'text-red-400' : 'text-green-400'}`}>
              {product.stock < 5 ? `⚠️ Only ${product.stock} left in stock` : `✅ In Stock (${product.stock} available)`}
            </p>
            {user?.role === 'buyer' && (
              <button onClick={addToCart}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-xl transition">
                Add to Cart
              </button>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-[#1a1d27] border border-gray-800 rounded-2xl p-8">
          <h3 className="text-lg font-bold text-white mb-6">Reviews</h3>

          {/* Write Review */}
          {user?.role === 'buyer' && (
            <form onSubmit={submitReview} className="mb-8 pb-8 border-b border-gray-800">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Write a Review</h4>
              <div className="flex gap-2 mb-4">
                {[1,2,3,4,5].map((star) => (
                  <button key={star} type="button" onClick={() => setRating(star)}
                    className={`text-2xl transition ${star <= rating ? 'text-yellow-400' : 'text-gray-700 hover:text-gray-500'}`}>
                    ★
                  </button>
                ))}
              </div>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product..."
                className="w-full bg-[#0f1117] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition h-24 text-sm resize-none mb-3"
                required />
              <button type="submit" disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition disabled:opacity-50">
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-600 text-sm">No reviews yet. Be the first!</div>
          ) : (
            <div className="space-y-5">
              {reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-800 pb-5 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-white text-sm">{review.buyer?.name}</p>
                      <span className="text-yellow-400 text-sm">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                    </div>
                    <p className="text-xs text-gray-600">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}