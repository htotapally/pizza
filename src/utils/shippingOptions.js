import { medusaClient } from './client.js'
import { getMedusaV2Sdk } from './medusaV2Sdk.js'

/**
 * List shipping options for a cart.
 *
 * - **Medusa v2:** `GET /store/shipping-options?cart_id=` (JS SDK).
 * - **Medusa v1:** `GET /store/shipping-options/:cart_id` (medusa-js).
 */
export async function listCartShippingOptions(cartId) {
  try {
    const sdk = getMedusaV2Sdk()
    const res = await sdk.store.fulfillment.listCartOptions({ cart_id: cartId })
    const shipping_options = res.shipping_options ?? res.shippingOptions ?? []
    return { shipping_options }
  } catch (v2Err) {
    try {
      const { shipping_options } = await medusaClient.shippingOptions.listCartOptions(cartId)
      return { shipping_options: shipping_options ?? [] }
    } catch (v1Err) {
      const hint =
        v2Err?.message ||
        v1Err?.message ||
        'Could not load shipping options. Check that the Medusa Store API is reachable and the publishable key is valid.'
      throw new Error(hint)
    }
  }
}

/**
 * Load cart fields useful when shipping_options is empty (Medusa v2 fulfillment needs channel + inventory).
 */
export async function getCartShippingDiagnostics(cartId) {
  try {
    const sdk = getMedusaV2Sdk()
    const res = await sdk.store.cart.retrieve(cartId, {
      fields: 'id,region_id,sales_channel_id,items.id',
    })
    const cart = res.cart
    const sales_channel_id =
      cart?.sales_channel_id ?? cart?.sales_channel?.id ?? null
    return {
      region_id: cart?.region_id ?? null,
      sales_channel_id,
      line_item_count: cart?.items?.length ?? 0,
    }
  } catch {
    return null
  }
}
