import { Camera } from 'lucide-react'
import { lazy, Suspense, useEffect, useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import { CartProvider, useCart } from './context/CartContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProductGrid from './components/ProductGrid'
import CartDrawer from './components/CartDrawer'
import QuickView from './components/QuickView'

const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const siteTitle = 'Cars Market EG | Premium Automotive Goods & Rims'
const siteDescription = 'Cars Market EG - منتجات وإكسسوارات سيارات مختارة بعناية، جنوط عالية الأداء وقطع عناية للقيادة اليومية والاحترافية.'

function Storefront() {
  const [quickView, setQuickView] = useState(null)
  const [adminOpen, setAdminOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { count, setCartOpen } = useCart()

  useEffect(() => {
    document.title = adminOpen ? 'Admin Dashboard | Cars Market EG' : siteTitle
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.content = adminOpen ? 'Manage Cars Market EG inventory and orders.' : siteDescription
  }, [adminOpen])

  if (adminOpen) return <Suspense fallback={<main className="grid min-h-screen place-items-center bg-carbon text-red-500">Loading control room...</main>}><AdminDashboard onClose={() => setAdminOpen(false)} /></Suspense>

  return <>
    <Navbar onAdmin={() => setAdminOpen(true)} searchTerm={searchTerm} onSearch={setSearchTerm} />
    <Hero />
    <ProductGrid onQuickView={setQuickView} searchTerm={searchTerm} />
    <section className="shell border-t border-white/10 py-16 text-center"><p className="eyebrow">NO COMPROMISE</p><h2 className="section-title mx-auto max-w-2xl">MADE FOR THOSE WHO NEVER TAKE THE LONG WAY HOME.</h2></section>
    <footer className="border-t border-white/10 py-8"><div className="shell flex flex-col justify-between gap-4 text-xs text-white/35 sm:flex-row sm:items-center"><span>© 2026 CARS MARKET. EGYPT.</span><span>PREMIUM AUTOMOTIVE GOODS</span><a className="inline-flex items-center gap-2 text-red-500 transition hover:text-red-400" href="https://www.instagram.com/carsmarket.eg/" target="_blank" rel="noreferrer"><Camera size={16} /> Instagram</a></div></footer>
    <QuickView product={quickView} onClose={() => setQuickView(null)} />
    <CartDrawer />
    {count > 0 && <button className="mobile-cart" onClick={() => setCartOpen(true)}>Cart <b>{count}</b></button>}
  </>
}

export default function App() {
  return <AuthProvider><CartProvider><Storefront /></CartProvider></AuthProvider>
}
