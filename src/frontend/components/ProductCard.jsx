import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { ThemeContext } from './ThemeContext'

function formatMedusaPrice(amount) {
  if (amount == null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount / 100)
}

/**
 * Two modes:
 * - Medusa storefront: pass `title`, `thumbnail`, `price` (minor units), `productId` (ThemeContext not required).
 * - Storov API: pass `product` (uses ThemeContext for cart).
 */
function ProductCard(props) {
  const { product, title, thumbnail, price, productId } = props

  if (product) {
    return <ProductCardStorov product={product} />
  }

  return (
    <ProductCardMedusa
      title={title}
      thumbnail={thumbnail}
      price={price}
      productId={productId}
    />
  )
}

/** Original src/components/ProductCard — Medusa + Link */
function ProductCardMedusa({ title, thumbnail, price, productId }) {
  const formattedPrice = formatMedusaPrice(price)
  const imgSrc = thumbnail || '/images/pizza.png'

  return (
    <div className="flex-none w-48 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-shadow duration-200 hover:shadow-lg">
      <Link to={`/products/${productId}`} className="block">
        <img src={imgSrc} alt={title} className="h-32 w-full object-contain p-2" />
      </Link>
      <div className="p-3">
        <h3 className="mb-1 truncate text-sm font-semibold text-gray-800">{title}</h3>
        <p className="mb-3 text-lg font-bold text-green-700">{formattedPrice}</p>
        <Link
          to={`/products/${productId}`}
          className="text-sm font-semibold text-red-700 hover:text-red-900"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

/** Storov backend product + cart */
function ProductCardStorov({ product }) {
  const { token, IMAGE_BASE_URL, API_ORDER_URL, guestSessionId, setGuestSessionId } =
    useContext(ThemeContext)
  const [addingToCart, setAddingToCart] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const handleAddToCart = async () => {
    setMessage('')
    setMessageType('')
    setAddingToCart(true)

    try {
      const headers = { 'Content-Type': 'application/json' }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      } else if (guestSessionId) {
        headers['X-Guest-Session-Id'] = guestSessionId
      } else {
        setMessage('Error: No session found. Please refresh the page.')
        setMessageType('error')
        setAddingToCart(false)
        return
      }

      const response = await fetch(`${API_ORDER_URL}/api/cart/add`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ product_id: product.id, quantity: 1 }),
      })

      const newGuestIdHeader = response.headers.get('X-New-Guest-Session-Id')
      if (newGuestIdHeader && newGuestIdHeader !== guestSessionId) {
        localStorage.setItem('storov_guest_session_id', newGuestIdHeader)
        setGuestSessionId(newGuestIdHeader)
      }

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message || 'Item added to cart!')
        setMessageType('success')
      } else {
        throw new Error(data.message || 'Failed to add item to cart.')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      setMessage(error.message)
      setMessageType('error')
    } finally {
      setAddingToCart(false)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleImageError = (e) => {
    e.target.onerror = null
    e.target.src = `https://placehold.co/150x150/cccccc/333333?text=${encodeURIComponent(product.title.substring(0, 10))}...`
  }

  const productImageUrl =
    product.images && product.images[0] && product.images[0].uri
      ? product.images[0].uri.replace('http://localhost', IMAGE_BASE_URL)
      : `https://placehold.co/150x150/cccccc/333333?text=No+Image`

  return (
    <div className="flex-none w-48 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-shadow duration-200 hover:shadow-lg">
      <img
        src={productImageUrl}
        alt={product.title}
        className="h-32 w-full object-contain p-2"
        onError={handleImageError}
      />
      <div className="p-3">
        <h3 className="mb-1 truncate text-sm font-semibold text-gray-800">{product.title}</h3>
        <p className="mb-2 text-xs text-gray-600">{product.brands && product.brands.join(', ')}</p>
        <p className="mb-3 text-lg font-bold text-green-700">
          ${parseFloat(product.price_info?.price).toFixed(2) || 'N/A'}
        </p>

        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full rounded-full bg-green-500 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={addingToCart}
        >
          {addingToCart ? 'Adding...' : 'Add to Cart'}
        </button>
        {message && (
          <p
            className={`mt-2 text-center text-xs ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

export default ProductCard
