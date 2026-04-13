import { medusaClient } from './client.js'
import { getMedusaBaseUrl } from './medusaBaseUrl.js'

export const REGION_ID = import.meta.env.VITE_MEDUSA_DEFAULT_REGION_ID?.trim() || 'reg_01KN4JM1SKHY8BXNRSRQ4RMDWY'

/** Set in `.env` to match the sales channel linked to your publishable API key (Medusa v2). */
const SALES_CHANNEL_ID = import.meta.env.VITE_MEDUSA_SALES_CHANNEL_ID || undefined

const CART_ID_STORAGE_KEY = 'medusa_cart_id'

export function getCartItemCount(cart) {
  if (!cart?.items?.length) return 0
  return cart.items.reduce((sum, line) => sum + (line.quantity ?? 0), 0)
}

/** Amounts from Medusa store API are in the region’s smallest currency unit (e.g. cents). */
export function formatMoney(amount, currencyCode = 'usd') {
  if (amount == null || Number.isNaN(amount)) return '—'
  const code = String(currencyCode || 'usd').toUpperCase()
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: code }).format(amount / 100)
  } catch {
    return `${(amount / 100).toFixed(2)} ${code}`
  }
}

export function lineItemImageUrl(item) {
  const t = item.thumbnail
  if (!t) return '/images/pizza.png'
  if (t.startsWith('http')) return t
  const base = getMedusaBaseUrl()
  return `${base}${t.startsWith('/') ? '' : '/'}${t}`
}

export function lineItemTitle(item) {
  return (
    item.title ||
    item.variant?.product?.title ||
    item.variant?.title ||
    'Item'
  )
}

export async function getOrCreateCart() {
  const existingId = localStorage.getItem(CART_ID_STORAGE_KEY)
  if (existingId) {
    try {
      const { cart } = await medusaClient.carts.retrieve(existingId)
      if (cart?.id) return cart
    } catch {
      localStorage.removeItem(CART_ID_STORAGE_KEY)
    }
  }

  const createPayload = { region_id: REGION_ID }
  if (SALES_CHANNEL_ID) createPayload.sales_channel_id = SALES_CHANNEL_ID
  const { cart } = await medusaClient.carts.create(createPayload)
  if (cart?.id) {
    localStorage.setItem(CART_ID_STORAGE_KEY, cart.id)
  }
  return cart
}

/**
 * @param {string} variantId
 * @param {number} [quantity=1]
 * @returns {Promise<import('@medusajs/medusa-js').Cart>}
 */
export async function addVariantToCart(variantId, quantity = 1) {
  const cart = await getOrCreateCart()
  const { cart: updated } = await medusaClient.carts.lineItems.create(cart.id, {
    variant_id: variantId,
    quantity,
  })
  return updated
}
