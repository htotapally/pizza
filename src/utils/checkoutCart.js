import { medusaClient } from './client.js'
import { REGION_ID } from './cart.js'
import { getMedusaV2Sdk } from './medusaV2Sdk.js'

/**
 * Update cart for checkout (address + email). Prefers Medusa v2 JS SDK body shape;
 * falls back to medusa-js if the v2 request fails.
 */
export async function updateCartCheckout(cartId, { email, shipping_address, billing_address }) {
  const sales_channel_id = import.meta.env.VITE_MEDUSA_SALES_CHANNEL_ID || undefined
  const body = {
    shipping_address,
    billing_address,
    region_id: REGION_ID,
  }
  if (email?.trim()) {
    body.email = email.trim()
  }
  if (sales_channel_id) body.sales_channel_id = sales_channel_id

  const sdk = getMedusaV2Sdk()
  try {
    const res = await sdk.store.cart.update(cartId, body)
    return res.cart
  } catch {
    const { cart } = await medusaClient.carts.update(cartId, body)
    return cart
  }
}
