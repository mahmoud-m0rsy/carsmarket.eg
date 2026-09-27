import { useEffect, useMemo, useState } from 'react'
import ProductCard from './ProductCard'
import { fetchProducts } from '../services/supabaseService'

const filters = ['All', 'Accessories', 'Clothes']

export default function ProductGrid({ onQuickView, searchTerm = '' }) {
  const [filter, setFilter] = useState('All')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    fetchProducts(filter)
      .then((data) => active && setProducts(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [filter])

  const visibleProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return products
    return products.filter((product) => `${product.name} ${product.description || ''}`.toLowerCase().includes(query))
  }, [products, searchTerm])

  return <section id="shop" className="shell py-20 sm:py-28">
    <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
      <div><p className="eyebrow">SELECTED GOODS</p><h2 className="section-title">SHOP THE PIT LANE</h2></div>
      <div className="filter-tabs" role="tablist">{filters.map((item) => <button onClick={() => setFilter(item)} className={filter === item ? 'active' : ''} key={item}>{item}</button>)}</div>
    </div>
    <div className="mt-10">{loading ? <p className="py-16 text-center text-white/50">Loading inventory...</p> : error ? <p className="py-16 text-center text-red-300">{error}</p> : visibleProducts.length === 0 ? <p className="py-16 text-center text-white/50">No products match your search.</p> : <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">{visibleProducts.map((product) => <ProductCard product={product} onQuickView={onQuickView} key={product.id} />)}</div>}</div>
  </section>
}
