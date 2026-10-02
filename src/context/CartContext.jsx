import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { createOrder, DEFAULT_WHATSAPP_NUMBER, fetchWhatsappNumber } from '../services/supabaseService'

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
      const existing = current.find((item) => item.id === product.id && item.selectedSize === product.selectedSize)
      return existing
        ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { ...product, quantity: 1 }]
    })
    setCartOpen(true)
  }
  const updateQuantity = (id, quantity) => setItems((current) => quantity < 1 ? current.filter((item) => item.id !== id) : current.map((item) => item.id === id ? { ...item, quantity } : item))
  const removeItem = (id) => setItems((current) => current.filter((item) => item.id !== id))
  const checkout = async ({ name, phone, governorate, address }) => {
    if (!items.length) throw new Error('Your cart is empty.')
    const orderItems = items.map(({ id, name: productName, price, quantity, selectedSize }) => ({ product_id: id, name: productName, price, quantity, size: selectedSize || null }))
    let number = DEFAULT_WHATSAPP_NUMBER
    try { number = (await fetchWhatsappNumber()) || number } catch { /* use configured fallback */ }
    const order = await createOrder({ customer_name: name, phone, whatsapp_phone: number, governorate, address, items: orderItems, total_price: totals.subtotal, payment_method: 'Cash on Delivery' })
    const breakdown = items.map((item) => `• ${item.name} × ${item.quantity} — ${item.price * item.quantity} جنيه`).join('\n')
    const message = `مرحباً Cars Market،%0Aأرغب في تأكيد هذا الطلب:%0A${encodeURIComponent(breakdown)}%0A%0Aالإجمالي: ${encodeURIComponent(`${totals.subtotal} جنيه`)}%0Aالاسم: ${encodeURIComponent(name)}%0Aالهاتف: ${encodeURIComponent(phone)}%0Aالمحافظة: ${encodeURIComponent(governorate)}%0Aالعنوان: ${encodeURIComponent(address)}%0Aرقم الطلب: ${encodeURIComponent(order.id)}`
    const digits = String(number).replace(/\D/g, '')
    const destination = digits.startsWith('0') ? `20${digits.slice(1)}` : digits
    window.open(`https://wa.me/${destination}?text=${message}`, '_blank', 'noopener,noreferrer')
    setItems([]); setCartOpen(false); return order
  }
  const totals = useMemo(() => ({
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  }), [items])

  return <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, checkout, isCartOpen, setCartOpen, ...totals }}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
