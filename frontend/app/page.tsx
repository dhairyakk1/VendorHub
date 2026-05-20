import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-100">
      {/* Navbar */}
      <nav className="border-b border-gray-800 px-10 py-4 flex justify-between items-center sticky top-0 bg-[#0f1117]/90 backdrop-blur z-50">
        <h1 className="text-xl font-bold text-white">Vendor<span className="text-blue-500">Hub</span></h1>
        <div className="flex gap-3">
          <Link href="/login" className="text-sm text-gray-400 hover:text-white px-4 py-2 rounded-lg transition">Login</Link>
          <Link href="/register" className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition font-medium">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-10 py-32 text-center max-w-4xl mx-auto">
        <div className="inline-block bg-blue-500/10 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full mb-6 border border-blue-500/20">
          🚀 DevFusion Hackathon 2.0
        </div>
        <h2 className="text-6xl font-extrabold mb-6 leading-tight tracking-tight">
          Your Local Market,<br />
          <span className="text-blue-500">Now Online</span>
        </h2>
        <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          VendorHub connects local sellers with buyers in their community. Shop smart, sell easy, grow together.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/products" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-xl transition">
            Browse Products
          </Link>
          <Link href="/register" className="border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-semibold px-8 py-3 rounded-xl transition">
            Become a Seller
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-10 border-t border-gray-800">
        <h3 className="text-2xl font-bold text-center mb-12 text-white">Why VendorHub?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { icon: '🛒', title: 'Easy Shopping', desc: 'Browse local products, add to cart, and checkout in seconds with our smooth buying experience.' },
            { icon: '🏪', title: 'Sell with Ease', desc: 'List your products, manage inventory, track orders, and grow your business — all in one place.' },
            { icon: '🤖', title: 'AI Powered', desc: 'Smart recommendations and fuzzy search help buyers find exactly what they need, faster.' },
          ].map((f) => (
            <div key={f.title} className="bg-[#1a1d27] border border-gray-800 rounded-2xl p-6 hover:border-blue-500/50 transition">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h4 className="text-lg font-semibold mb-2 text-white">{f.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-10 border-t border-gray-800">
        <h3 className="text-2xl font-bold text-center mb-12 text-white">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            { step: '01', title: 'Create Account', desc: 'Sign up as a buyer or seller in seconds' },
            { step: '02', title: 'Browse or List', desc: 'Shop products or list your own items' },
            { step: '03', title: 'Order & Pay', desc: 'Secure sandbox checkout with order summary' },
            { step: '04', title: 'Track & Review', desc: 'Track your order and leave a review' },
          ].map((s, i) => (
            <div key={s.step} className="relative text-center">
              <div className="text-4xl font-black text-blue-500/20 mb-2">{s.step}</div>
              <h4 className="font-semibold text-white mb-1">{s.title}</h4>
              <p className="text-gray-400 text-sm">{s.desc}</p>
              {i < 3 && <div className="hidden md:block absolute top-5 right-0 w-1/2 h-px bg-gray-800" />}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-10 border-t border-gray-800 text-center">
        <h3 className="text-3xl font-bold mb-4 text-white">Ready to get started?</h3>
        <p className="text-gray-400 mb-8">Join local vendors and buyers on VendorHub today.</p>
        <Link href="/register" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-10 py-3 rounded-xl transition text-lg">
          Join VendorHub Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 text-center py-6 text-gray-600 text-sm">
        © 2026 VendorHub — Built for DevFusion Hackathon 2.0
      </footer>
    </div>
  );
}