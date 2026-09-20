import { Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import brandLogo from '../assets/logo.png'

export default function Navbar({ onAdmin }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, isAdmin, signInWithGoogle, signOut } = useAuth()
  const { count, setCartOpen } = useCart()
  const handleAuth = async () => { try { if (user) await signOut(); else await signInWithGoogle() } catch (error) { alert(error.message) } }
  const links = ['Shop', 'Rims', 'Performance', 'Care']

  return <header className="sticky top-0 z-40 border-b border-white/8 bg-carbon/75 backdrop-blur-xl">
    <nav className="shell nav-shell flex items-center justify-between gap-3" aria-label="Main navigation">
      <a className="brand flex items-center gap-2" href="#top" aria-label="Cars Market home"><span className="logo-slot"><img src={brandLogo} alt="" /></span><span className="brand-copy">CARS MARKET<i>.EG</i></span></a>
      <div className="hidden items-center gap-7 lg:flex">{links.map((link) => <a className="nav-link" href="#shop" key={link}>{link}</a>)}</div>
      <label className="search-bar ml-auto hidden max-w-sm flex-1 items-center md:flex"><Search size={16} /><input aria-label="Search products" className="w-full bg-transparent px-2 outline-none placeholder:text-white/35" placeholder="Search parts, wheels, brands..." /></label>
      <div className="flex items-center gap-2">
        {isAdmin && <button className="icon-button hidden sm:grid" onClick={onAdmin} aria-label="Open dashboard"><UserRound size={18} /></button>}
        <button className="icon-button relative" onClick={() => setCartOpen(true)} aria-label={`Open cart, ${count} items`}><ShoppingBag size={19} />{count > 0 && <b className="cart-count">{count}</b>}</button>
        <button className="auth-button hidden sm:flex" onClick={handleAuth}>{user ? <><img className="h-5 w-5 rounded-full" src={user.user_metadata?.avatar_url} alt="" /> Sign out</> : 'Sign in'}</button>
        <button className="icon-button grid lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu size={21} /></button>
      </div>
    </nav>
    <div className={`menu-scrim ${menuOpen ? 'visible' : ''}`} onClick={() => setMenuOpen(false)} />
    <aside className={`mobile-menu ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
      <div className="flex items-center justify-between"><span className="brand">CARS MARKET<i>.EG</i></span><button className="icon-button" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></button></div>
      <nav className="mobile-nav" aria-label="Mobile navigation">{links.map((link) => <a onClick={() => setMenuOpen(false)} href="#shop" key={link}>{link}</a>)}</nav>
      <div className="mobile-auth">
        {user && <div className="mobile-profile">{user.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} alt="" /> : <UserRound size={17} />}<span>{user.user_metadata?.full_name || user.email}</span></div>}
        <button className="auth-button" onClick={handleAuth}>{user ? 'Log out' : 'Sign in with Google'}</button>
      </div>
    </aside>
  </header>
}
