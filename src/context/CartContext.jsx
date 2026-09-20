import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'cars-market-cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [] } catch { return [] }
  })
  const [isCartOpen, setCartOpen] = useState(false)

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(items)), [items])

  const addItem = (product) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id)
      return existing
        ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { ...product, quantity: 1 }]
    })
    setCartOpen(true)
  }
  const updateQuantity = (id, quantity) => setItems((current) => quantity < 1 ? current.filter((item) => item.id !== id) : current.map((item) => item.id === id ? { ...item, quantity } : item))
  const removeItem = (id) => setItems((current) => current.filter((item) => item.id !== id))
  const totals = useMemo(() => ({
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  }), [items])

  return <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, isCartOpen, setCartOpen, ...totals }}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
