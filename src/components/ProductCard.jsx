import { Eye, Plus } from 'lucide-react'
import { useRef } from 'react'
import gsap from 'gsap'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product, onQuickView }) {
  const { addItem } = useCart()
  const cardRef = useRef(null)
  const tilt = (event) => { if (!window.matchMedia('(pointer: fine)').matches) return; const box = cardRef.current.getBoundingClientRect(); gsap.to(cardRef.current, { rotateX: ((event.clientY - box.top) / box.height - .5) * -4, rotateY: ((event.clientX - box.left) / box.width - .5) * 4, y: -5, duration: .35, ease: 'power2.out', transformPerspective: 900 }) }
  const reset = () => gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, y: 0, duration: .5, ease: 'power3.out' })
  return <article ref={cardRef} onMouseMove={tilt} onMouseLeave={reset} className="product-card group">
    <button className="product-image" onClick={() => onQuickView(product)} aria-label={`Quick view ${product.name}`}><img loading="lazy" src={product.image} alt={product.name} /><span className={`stock ${product.stock ? 'in-stock' : ''}`}>{product.stock ? 'In stock' : 'Limited'}</span><span className="quick-view"><Eye size={17} /> Quick view</span></button>
    <div className="flex items-start justify-between gap-3 pt-4"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-gold">{product.category}</p><h3 className="mt-1 text-base font-bold">{product.name}</h3><p className="mt-1 font-mono text-sm text-white/55">EGP {product.price.toLocaleString()}</p></div><button onClick={() => addItem(product)} className="add-button" aria-label={`Add ${product.name} to cart`}><Plus size={19} /></button></div>
  </article>
}
