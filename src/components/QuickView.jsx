import { ShoppingBag, X } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function QuickView({ product, onClose }) {
  const { addItem } = useCart()
  if (!product) return null

  return <div className="modal-backdrop" onMouseDown={onClose}>
    <section className="quick-modal" onMouseDown={(event) => event.stopPropagation()} aria-modal="true" role="dialog">
      <button className="icon-button absolute right-4 top-4 z-10" onClick={onClose} aria-label="Close product preview"><X /></button>
      <img loading="lazy" src={product.image} alt={product.name} />
      <div className="p-7">
        <p className="eyebrow">{product.category}</p>
        <h2 className="mt-2 text-3xl font-black">{product.name}</h2>
        <p className="mt-4 font-mono text-lg text-red-500">EGP {product.price.toLocaleString()}</p>
        <p className="mt-5 text-sm leading-6 text-white/60">Engineered to make every detail of your build feel intentional. Sourced for performance, finished for the street.</p>
        <button className="cta mt-7" onClick={() => { addItem(product); onClose() }}><ShoppingBag size={17} /> Add to cart</button>
      </div>
    </section>
  </div>
}
