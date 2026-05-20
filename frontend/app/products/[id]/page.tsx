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
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await API.get(`/reviews/${id}`);
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const exists = cart.find((i: any) => i._id === product._id);
    if (exists) {
      exists.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
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
      setLoading(false);
    }
  };

  if (!product) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster />
      <nav className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">VendorHub</h1>
        <div className="flex gap-4">
          <a href="/products" className="text-sm text-gray-600 hover:text-blue-600">← Back to Products</a>
          <a href="/cart" className="text-sm text-gray-600 hover:text-blue-600">🛒 Cart</a>
        </div>
      </nav>

      <div className="p-8 max-w-4xl mx-auto">
        {/* Product Info */}
        <div className="bg-white rounded-xl shadow p-6 mb-6 flex gap-8">
          <div className="bg-gray-200 h-64 w-64 rounded-xl flex items-center justify-center flex-shrink-0">
            {product.images?.[0] ? (
              <img src={product.images[0]} alt={product.name}
                className="h-full w-full object-cover rounded-xl" />
            ) : (
              <span className="text-gray-400">No image</span>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
            <p className="text-gray-500 text-sm mb-2">{product.category}</p>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-yellow-400">{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
              <span className="text-sm text-gray-500">({product.numReviews} reviews)</span>
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-3">₹{product.price}</p>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-sm text-gray-500 mb-4">
              Sold by: <span className="font-semibold">{product.seller?.name}</span>
            </p>
            <p className={`text-sm mb-4 ${product.stock < 5 ? 'text-red-500' : 'text-green-600'}`}>
              {product.stock < 5 ? `⚠️ Only ${product.stock} left!` : `✅ In Stock (${product.stock})`}
            </p>
            {user?.role === 'buyer' && (
              <button onClick={addToCart}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold">
                Add to Cart
              </button>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold mb-4">Reviews</h3>

          {/* Add Review Form */}
          {user?.role === 'buyer' && (
            <form onSubmit={submitReview} className="mb-6 border-b pb-6">
              <h4 className="font-semibold mb-3">Write a Review</h4>
              <div className="flex gap-2 mb-3">
                {[1,2,3,4,5].map((star) => (
                  <button key={star} type="button" onClick={() => setRating(star)}
                    className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                    ★
                  </button>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                className="w-full border rounded-lg px-4 py-2 h-20 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                required
              />
              <button type="submit" disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No reviews yet. Be the first!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{review.buyer?.name}</p>
                      <span className="text-yellow-400">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                    </div>
                    <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p className="text-gray-600 mt-1 text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}