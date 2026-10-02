import { useEffect, useMemo, useState } from 'react'
import ProductCard from './ProductCard'
import { fetchOrders, fetchProducts } from '../services/supabaseService'

const filters = ['All', 'Accessories', 'Clothes', 'Top Seller']
const sizes = ['S', 'M', 'L', 'XL']

export default function ProductGrid({ onQuickView, searchTerm = '' }) {
  const [filter, setFilter] = useState('All')
  const [sizeFilter, setSizeFilter] = useState('All')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    const load = async () => {
      try {
        const all = await fetchProducts(filter === 'Top Seller' ? undefined : filter)
        if (filter === 'Top Seller') {
          const orders = await fetchOrders()
          const counts = new Map()
          orders.forEach((order) => {
            const items = Array.isArray(order.items) ? order.items : []
            items.forEach((item) => counts.set(item.product_id, (counts.get(item.product_id) || 0) + Number(item.quantity || 1)))
          })
          if (active) setProducts(all.filter((product) => counts.has(product.id)).sort((a, b) => counts.get(b.id) - counts.get(a.id)))
        } else if (active) setProducts(all)
      } catch (err) {
        if (active) setError(err.message)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [filter])

  const visibleProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    return products.filter((product) => (!query || `${product.name} ${product.description || ''}`.toLowerCase().includes(query)) && (filter !== 'Clothes' || sizeFilter === 'All' || product.sizes.includes(sizeFilter)))
  }, [products, searchTerm, filter, sizeFilter])

  return <section id="shop" className="shell py-20 sm:py-28"><div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end"><div><p className="eyebrow">SELECTED GOODS</p><h2 className="section-title">SHOP THE PIT LANE</h2></div><div className="filter-tabs" role="tablist">{filters.map((item) => <button onClick={() => { setFilter(item); if (item !== 'Clothes') setSizeFilter('All') }} className={filter === item ? 'active' : ''} key={item}>{item}</button>)}</div></div>{filter === 'Clothes' && <div className="mt-5 flex items-center gap-2" aria-label="Filter clothes by size"><span className="text-xs uppercase tracking-wider text-white/45">Size</span>{['All', ...sizes].map((size) => <button key={size} onClick={() => setSizeFilter(size)} className={`rounded border px-3 py-1 text-xs ${sizeFilter === size ? 'border-red-500 bg-red-500 text-black' : 'border-white/15 text-white/60'}`}>{size}</button>)}</div>}<div className="mt-10">{loading ? <p className="py-16 text-center text-white/50">Loading inventory...</p> : error ? <p className="py-16 text-center text-red-300">{error}</p> : visibleProducts.length === 0 ? <p className="py-16 text-center text-white/50">No products match your search.</p> : <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">{visibleProducts.map((product) => <ProductCard product={product} onQuickView={onQuickView} key={product.id} />)}</div>}</div></section>
}
