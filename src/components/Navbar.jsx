import { Menu, Search, ShoppingBag, UserRound } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import brandLogo from '../assets/logo.png'

export default function Navbar({ onAdmin, searchTerm, onSearch }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const triggerRef = useRef(null)
  const { user, isAdmin, signInWithGoogle, signOut } = useAuth()
  const { count, setCartOpen } = useCart()
  const links = ['Accessories', 'Clothes']
  const handleAuth = async () => { try { if (user) await signOut(); else await signInWithGoogle() } catch (error) { alert(error.message) } }

  useEffect(() => {
    if (!menuOpen) return undefined
    const close = (event) => { if (!menuRef.current?.contains(event.target) && !triggerRef.current?.contains(event.target)) setMenuOpen(false) }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [menuOpen])

  return <header className="sticky top-0 z-40 border-b border-white/8 bg-carbon/75">
    <nav className="shell nav-shell flex items-center justify-between gap-3" aria-label="Main navigation">
      <a className="brand flex items-center gap-2" href="#top" aria-label="Cars Market home"><span className="logo-slot"><img src={brandLogo} alt="" /></span><span className="brand-copy">CARS MARKET<i>.EG</i></span></a>
      <div className="hidden items-center gap-7 lg:flex">{links.map((link) => <a className="nav-link" href="#shop" key={link}>{link}</a>)}</div>
      <label className="search-bar ml-auto hidden max-w-sm flex-1 items-center md:flex"><Search size={16} /><input value={searchTerm} onChange={(event) => onSearch(event.target.value)} aria-label="Search products" className="w-full bg-transparent px-2 outline-none placeholder:text-white/35" placeholder="Search parts, wheels, brands..." /></label>
      <label className="search-bar mobile-search flex max-w-[10rem] flex-1 items-center md:hidden"><Search size={15} /><input value={searchTerm} onChange={(event) => onSearch(event.target.value)} aria-label="Search products" className="w-full min-w-0 bg-transparent px-2 text-xs outline-none placeholder:text-white/35" placeholder="Search..." /></label>
      <div className="flex items-center gap-2">
        {isAdmin && <button className="icon-button hidden sm:grid" onClick={onAdmin} aria-label="Open dashboard"><UserRound size={18} /></button>}
        <button className="icon-button relative" onClick={() => setCartOpen(true)} aria-label={`Open cart, ${count} items`}><ShoppingBag size={19} />{count > 0 && <b className="cart-count">{count}</b>}</button>
        <button className="auth-button hidden sm:flex" onClick={handleAuth}>{user ? <><img loading="lazy" className="h-5 w-5 rounded-full" src={user.user_metadata?.avatar_url} alt="" /> Sign out</> : 'Sign in'}</button>
        <button ref={triggerRef} className="icon-button grid min-h-11 min-w-11 lg:hidden" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Close menu' : 'Open menu'}><Menu size={21} /></button>
      </div>
    </nav>
    {menuOpen && <div ref={menuRef} className="mobile-dropdown absolute right-4 top-16 z-[999]" role="menu"><nav aria-label="Mobile navigation">{links.map((link) => <a onClick={() => setMenuOpen(false)} href="#shop" key={link}>{link}</a>)}</nav><div className="dropdown-auth">{user && <div className="mobile-profile">{user.user_metadata?.avatar_url ? <img loading="lazy" src={user.user_metadata.avatar_url} alt="" /> : <UserRound size={17} />}<span>{user.user_metadata?.full_name || user.email}</span></div>}<button onClick={handleAuth}>{user ? 'Log out' : 'Sign in with Google'}</button></div></div>}
  </header>
}
