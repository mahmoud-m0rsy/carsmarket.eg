import { Eye, Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product, onQuickView }) {
  const { addItem } = useCart(); const cardRef = useRef(null); const timerRef = useRef(null); const [imageIndex, setImageIndex] = useState(0); const [selectedSize, setSelectedSize] = useState('')
  const images = product.images?.length ? product.images : [product.image]
  const isClothing = product.category === 'Clothes'; const canAdd = !isClothing || selectedSize
  const add = () => { if (canAdd) addItem({ ...product, selectedSize }) }
  const tilt = (event) => { if (!window.matchMedia('(pointer: fine)').matches) return; const box = cardRef.current.getBoundingClientRect(); gsap.to(cardRef.current, { rotateX: ((event.clientY - box.top) / box.height - .5) * -4, rotateY: ((event.clientX - box.left) / box.width - .5) * 4, y: -5, duration: .35, ease: 'power2.out', transformPerspective: 900 }) }
  const reset = () => gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, y: 0, duration: .5, ease: 'power3.out' })
  const startCarousel = () => { if (images.length < 2) return; timerRef.current = window.setInterval(() => setImageIndex((index) => (index + 1) % images.length), 1400) }
  const stopCarousel = () => { window.clearInterval(timerRef.current); timerRef.current = null; setImageIndex(0) }
  useEffect(() => () => window.clearInterval(timerRef.current), [])
  return <article ref={cardRef} onMouseMove={tilt} onMouseEnter={startCarousel} onMouseLeave={() => { stopCarousel(); reset() }} className="product-card group"><button className="product-image" onClick={() => onQuickView(product)} aria-label={`Quick view ${product.name}`}><img loading="lazy" src={images[imageIndex]} alt={product.name} /><span className={`stock ${product.stock ? 'in-stock' : ''}`}>{product.stock ? 'In stock' : 'Limited'}</span><span className="quick-view"><Eye size={17} /> Quick view</span></button><div className="flex items-start justify-between gap-3 pt-4"><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-red-500">{product.category}</p><h3 className="mt-1 text-base font-bold">{product.name}</h3><p className="mt-1 font-mono text-sm text-white/55">EGP {product.price.toLocaleString()}</p>{isClothing && <div className="mt-2 flex flex-wrap gap-1">{product.sizes.map((size) => <button type="button" key={size} onClick={() => setSelectedSize(size)} className={`rounded border px-2 py-1 text-[10px] ${selectedSize === size ? 'border-red-500 bg-red-500 text-black' : 'border-white/15 text-white/60'}`}>{size}</button>)}</div>}</div><button disabled={!canAdd} onClick={add} className="add-button disabled:cursor-not-allowed disabled:opacity-30" aria-label={`Add ${product.name} to cart`}><Plus size={19} /></button></div></article>
}
