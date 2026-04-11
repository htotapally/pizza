import { useState } from 'react'
import { addVariantToCart } from '../utils/cart.js'

/**
 * Quantity stepper (− / field / +) and Pizza O Pizza-style “Add to cart”.
 */
export default function AddToCartButton({ variantId, className = '' }) {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [success, setSuccess] = useState(true)

  const decrement = () => {
    setQuantity((q) => Math.max(1, q - 1))
  }

  const increment = () => {
    setQuantity((q) => Math.min(999, q + 1))
  }

  const onQuantityChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '')
    if (raw === '') {
      setQuantity(1)
      return
    }
    const n = parseInt(raw, 10)
    if (!Number.isNaN(n)) {
      setQuantity(Math.min(999, Math.max(1, n)))
    }
  }

  const handleAdd = async () => {
    if (!variantId) return
    const qty = Math.min(999, Math.max(1, quantity))
    setLoading(true)
    setMessage(null)
    try {
      const cart = await addVariantToCart(variantId, qty)
      window.dispatchEvent(new CustomEvent('medusa-cart-updated', { detail: { cart } }))
      setMessage('Added to cart')
      setSuccess(true)
      setTimeout(() => setMessage(null), 2500)
    } catch (e) {
      setMessage(e?.message ?? 'Could not add to cart')
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  const disabled = !variantId || loading
  const canDecrement = quantity > 1

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-stretch overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm">
        <button
          type="button"
          disabled={!variantId || !canDecrement}
          onClick={decrement}
          className="flex w-10 shrink-0 items-center justify-center border-r border-gray-300 bg-gray-50 text-lg font-semibold leading-none text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          aria-label="Quantity"
          disabled={!variantId}
          value={String(quantity)}
          onChange={onQuantityChange}
          className="min-w-0 flex-1 border-0 bg-white px-2 py-2 text-center text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 disabled:bg-gray-100"
        />
        <button
          type="button"
          disabled={!variantId || quantity >= 999}
          onClick={increment}
          className="flex w-10 shrink-0 items-center justify-center border-l border-gray-300 bg-gray-50 text-lg font-semibold leading-none text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={handleAdd}
        className="w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Adding…' : 'Add to cart'}
      </button>
      {message && (
        <p
          className={`text-center text-xs ${success ? 'text-green-600' : 'text-red-600'}`}
          role="status"
        >
          {message}
        </p>
      )}
    </div>
  )
}
