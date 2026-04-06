import { useState, useEffect, createContext, useContext } from 'react'

const CartContext = createContext(null)

const getStoredCart = () => {
  try {
    return JSON.parse(localStorage.getItem('irongrid_cart')) || []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(getStoredCart)

  // Sync to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('irongrid_cart', JSON.stringify(items))
  }, [items])

  // Re-sync from localStorage when window gets focus
  // This handles the case where cart was updated in another tab/page
  useEffect(() => {
    const handleFocus = () => setItems(getStoredCart())
    const handleStorage = () => setItems(getStoredCart())
    window.addEventListener('focus', handleFocus)
    window.addEventListener('storage', handleStorage)
    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const addItem = (product, quantity, days) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity, days } : i)
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        image: product.image,
        category: product.category?.name,
        price: product.is_sale ? product.sale_price : product.price,
        quantity,
        days,
      }]
    })
  }

  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id))
  const clearCart = () => setItems([])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + (Number(i.price) * i.quantity * i.days), 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
