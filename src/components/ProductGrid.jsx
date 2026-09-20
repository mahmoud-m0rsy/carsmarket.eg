import { useState } from 'react'
import ProductCard from './ProductCard'

export const products = [
  { id: 'r1', name: 'Obsidian Forged 19', category: 'Rims', price: 28900, stock: true, image: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=900&q=80' },
  { id: 'r2', name: 'Velocity Sport Intake', category: 'Tuning', price: 7450, stock: true, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80' },
  { id: 'r3', name: 'Bespoke Cabin Kit', category: 'Accessories', price: 3290, stock: true, image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80' },
  { id: 'r4', name: 'Ceramic Shield Pro', category: 'Maintenance', price: 1800, stock: false, image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80' },
]
const filters = ['All', 'Rims', 'Tuning', 'Accessories', 'Maintenance']
export default function ProductGrid({ onQuickView }) { const [filter, setFilter] = useState('All'); const visible = filter === 'All' ? products : products.filter((item) => item.category === filter)
  return <section id="shop" className="shell py-20 sm:py-28"><div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end"><div><p className="eyebrow">SELECTED GOODS</p><h2 className="section-title">SHOP THE PIT LANE</h2></div><div className="filter-tabs" role="tablist">{filters.map((item) => <button onClick={() => setFilter(item)} className={filter === item ? 'active' : ''} key={item}>{item}</button>)}</div></div><div className="mt-10 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">{visible.map((product) => <ProductCard product={product} onQuickView={onQuickView} key={product.id} />)}</div></section> }
