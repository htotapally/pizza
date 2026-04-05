import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AddToCartButton from '../components/AddToCartButton.jsx'
import { medusaClient } from '../utils/client.js'

const REGION_ID = 'reg_01KN4JM1SKHY8BXNRSRQ4RMDWY'

function formatPrice(amount) {
  if (amount == null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount / 100)
}

export default function ProductDetail() {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!productId) {
      setLoading(false)
      setError('Missing product id')
      return
    }

    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const { products } = await medusaClient.products.list({
          id: [productId],
          region_id: REGION_ID,
          limit: 10,
        })
        if (cancelled) return
        const found = products?.[0] ?? null
        if (!found) {
          setError('Product not found')
          setProduct(null)
        } else {
          setProduct(found)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e?.message ?? 'Failed to load product')
          setProduct(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [productId])

  const thumbnail = product?.thumbnail || '/images/pizza.png'
  const description = product?.description?.trim()

  return (
    <div className="mx-auto min-h-[50vh] max-w-4xl px-4 py-12">
      <Link to="/" className="text-sm font-semibold text-red-700 hover:text-red-900">
        ← Back to home
      </Link>

      {loading && (
        <p className="mt-8 text-center text-gray-600" role="status">
          Loading product…
        </p>
      )}

      {!loading && error && (
        <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">
          {error}
        </div>
      )}

      {!loading && !error && product && (
        <article className="mt-8">
          <div className="grid gap-10 md:grid-cols-2 md:items-start">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="aspect-square bg-gray-100">
                <img
                  src={thumbnail}
                  alt={product.title}
                  className="h-full w-full object-contain p-6"
                />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
              {description ? (
                description.includes('<') ? (
                  <div
                    className="mt-4 max-w-none text-gray-600 [&_a]:text-red-700 [&_p]:mb-2"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                ) : (
                  <p className="mt-4 whitespace-pre-wrap text-gray-600">{description}</p>
                )
              ) : (
                <p className="mt-4 text-gray-500">No description available.</p>
              )}

              {product.variants?.length > 0 && (
                <div className="mt-8 space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">Variants</h2>
                  <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
                    {product.variants.map((variant) => {
                      const price = variant?.calculated_price?.calculated_amount
                      const title = variant.title || 'Default'
                      return (
                        <li
                          key={variant.id}
                          className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex flex-wrap items-baseline gap-3">
                            <span className="font-medium text-gray-800">{title}</span>
                            <span className="text-lg font-bold text-red-600">{formatPrice(price)}</span>
                          </div>
                          <div className="w-full min-w-[140px] sm:w-40">
                            <AddToCartButton variantId={variant.id} />
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </article>
      )}
    </div>
  )
}
