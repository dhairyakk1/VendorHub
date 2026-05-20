import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 shadow-sm">
        <h1 className="text-2xl font-extrabold text-blue-600">VendorHub</h1>
        <div className="flex gap-4">
          <Link href="/login" className="text-sm text-gray-600 hover:text-blue-600 font-medium">Login</Link>
          <Link href="/register" className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-24 px-10 text-center">
        <h2 className="text-5xl font-extrabold mb-4 leading-tight">
          Your Local Market,<br />Now Online
        </h2>
        <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
          VendorHub connects local sellers with buyers in their community.
          Shop smart, sell easy, grow together.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/products"
            className="bg-white text-blue-600 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition">
            Browse Products
          </Link>
          <Link href="/register"
            className="border border-white text-white font-bold px-8 py-3 rounded-xl hover:bg-white hover:text-blue-600 transition">
            Become a Seller
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-10 bg-gray-50">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">Why VendorHub?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { icon: '🛒', title: 'Easy Shopping', desc: 'Browse local products, add to cart, and checkout in seconds with our smooth buying experience.' },
            { icon: '🏪', title: 'Sell with Ease', desc: 'List your products, manage inventory, track orders, and grow your business — all in one place.' },
            { icon: '🤖', title: 'AI Powered', desc: 'Smart recommendations and fuzzy search help buyers find exactly what they need, faster.' },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl shadow p-8 text-center hover:shadow-md transition">
              <div className="text-5xl mb-4">{f.icon}</div>
              <h4 className="text-xl font-bold mb-2 text-gray-800">{f.title}</h4>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-10">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            { step: '1', title: 'Create Account', desc: 'Sign up as a buyer or seller in seconds' },
            { step: '2', title: 'Browse or List', desc: 'Shop products or list your own items' },
            { step: '3', title: 'Order & Pay', desc: 'Secure sandbox checkout with order summary' },
            { step: '4', title: 'Track & Review', desc: 'Track your order and leave a review' },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {s.step}
              </div>
              <h4 className="font-bold text-gray-800 mb-1">{s.title}</h4>
              <p className="text-gray-500 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-16 px-10 text-center">
        <h3 className="text-3xl font-bold mb-4">Ready to get started?</h3>
        <p className="text-blue-100 mb-8">Join hundreds of local vendors and buyers on VendorHub today.</p>
        <Link href="/register"
          className="bg-white text-blue-600 font-bold px-10 py-3 rounded-xl hover:bg-blue-50 transition text-lg">
          Join VendorHub Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-400 text-sm">
        © 2026 VendorHub — Built for DevFusion Hackathon 2.0
      </footer>
    </div>
  );
}