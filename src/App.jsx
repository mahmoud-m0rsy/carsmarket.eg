import { lazy, Suspense, useEffect, useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import { CartProvider, useCart } from './context/CartContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProductGrid from './components/ProductGrid'
import CartDrawer from './components/CartDrawer'
import QuickView from './components/QuickView'
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))

function Storefront() {
  const [quickView, setQuickView] = useState(null); const [adminOpen, setAdminOpen] = useState(false); const { count, setCartOpen } = useCart()
  useEffect(() => { document.title = adminOpen ? 'Admin Dashboard | Cars Market' : 'Cars Market | Built for the Drive'; let meta = document.querySelector('meta[name="description"]'); if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta) }; meta.content = 'Cars Market Egypt — curated performance parts, premium wheels, and automotive essentials.' }, [adminOpen])
  if (adminOpen) return <Suspense fallback={<main className="grid min-h-screen place-items-center bg-carbon text-red-500">Loading control room…</main>}><AdminDashboard onClose={() => setAdminOpen(false)} /></Suspense>
  return <><Navbar onAdmin={() => setAdminOpen(true)} /><Hero /><ProductGrid onQuickView={setQuickView} /><section className="shell border-t border-white/10 py-16 text-center"><p className="eyebrow">NO COMPROMISE</p><h2 className="section-title mx-auto max-w-2xl">MADE FOR THOSE WHO NEVER TAKE THE LONG WAY HOME.</h2></section><footer className="border-t border-white/10 py-8"><div className="shell flex flex-col justify-between gap-3 text-xs text-white/35 sm:flex-row"><span>© 2026 CARS MARKET. EGYPT.</span><span>PREMIUM AUTOMOTIVE GOODS</span></div></footer><QuickView product={quickView} onClose={() => setQuickView(null)} /><CartDrawer />{count > 0 && <button className="mobile-cart" onClick={() => setCartOpen(true)}>Cart <b>{count}</b></button>}</>
}
export default function App() { return <AuthProvider><CartProvider><Storefront /></CartProvider></AuthProvider> }
