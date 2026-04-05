import { medusaClient } from './client.js'
import { getMedusaBaseUrl } from './medusaBaseUrl.js'
import { getMedusaV2Sdk } from './medusaV2Sdk.js'

const CART_PAYMENT_FIELDS =
  '*payment_collection,*payment_collection.payment_sessions,*payment_collection.payment_sessions.data,*region'

/**
 * Normalize Medusa v1 (`payment_sessions` on cart) and v2 (`payment_collection.payment_sessions`).
 */
export function cartPaymentSessions(cart) {
  if (!cart) return []
  const legacy = cart.payment_sessions
  if (Array.isArray(legacy) && legacy.length) return legacy
  const nested = cart.payment_collection?.payment_sessions
  if (Array.isArray(nested) && nested.length) return nested
  return []
}

export function sessionProviderId(session) {
  if (!session) return ''
  return session.provider_id ?? session.provider?.id ?? ''
}

function mergePaymentSessionsOntoCart(cart, sessions) {
  if (!cart) return cart
  return { ...cart, payment_sessions: sessions }
}

async function retrieveCartWithPayment(sdk, cartId) {
  const { cart } = await sdk.store.cart.retrieve(cartId, {
    fields: CART_PAYMENT_FIELDS,
  })
  return mergePaymentSessionsOntoCart(cart, cartPaymentSessions(cart))
}

/** Backend: zero shipping when payment is cash (see my-medusa-store sync-cash-shipping route). */
async function syncCashShippingZero(cartId) {
  const base = getMedusaBaseUrl()
  const pk = import.meta.env.VITE_API_MEDUSA_PUBLISHABLE_KEY?.trim()
  const headers = {}
  if (pk) {
    headers['x-publishable-api-key'] = pk
  }
  await fetch(`${base}/store/carts/${cartId}/sync-cash-shipping`, {
    method: 'POST',
    headers,
  })
}

/** Medusa cash module: `pp_cash_cash`. */
export function isCashPaymentProvider(providerId) {
  if (!providerId) return false
  const id = String(providerId).toLowerCase()
  return id.includes('cash') && id.includes('pp_')
}

function pickDefaultProvider(providers, opts = {}) {
  const { preferCash } = opts
  if (preferCash) {
    const cash = providers.find((p) => isCashPaymentProvider(p.id))
    if (cash) return cash
  }
  const stripe = providers.find((p) => p.id?.toLowerCase().includes('stripe'))
  if (stripe) return stripe
  const manual = providers.find(
    (p) =>
      p.id?.toLowerCase().includes('manual') ||
      p.id?.toLowerCase().includes('system_default'),
  )
  return manual ?? providers[0]
}

/** Medusa Stripe module uses provider ids like `pp_stripe_stripe`. */
export function isStripePaymentProvider(providerId) {
  if (!providerId) return false
  const id = String(providerId).toLowerCase()
  return id.includes('stripe')
}

export function getPaymentSessionClientSecret(session) {
  const data = session?.data
  if (!data || typeof data !== 'object') return null
  return data.client_secret ?? data.clientSecret ?? null
}

/**
 * Medusa v2: list providers → initiatePaymentSession (payment-collections API).
 * Medusa v1: createPaymentSessions → setPaymentSession.
 */
export async function prepareCartPayment(cart, options = {}) {
  if (!cart?.id) throw new Error('No cart')

  const sdk = getMedusaV2Sdk()
  try {
    const regionId = cart.region_id ?? cart.region?.id
    if (!regionId) throw new Error('Cart has no region')

    const { payment_providers = [] } = await sdk.store.payment.listPaymentProviders({
      region_id: regionId,
    })
    if (payment_providers.length === 0) {
      throw new Error('No payment providers')
    }

    const pick = pickDefaultProvider(payment_providers, {
      preferCash: !!options.preferCash,
    })
    const initRes = await sdk.store.payment.initiatePaymentSession(cart, {
      provider_id: pick.id,
      data: {},
    })
    const pcFromInit = initRes?.payment_collection

    if (isCashPaymentProvider(pick.id)) {
      await syncCashShippingZero(cart.id)
    }

    let updated = await retrieveCartWithPayment(sdk, cart.id)
    if (cartPaymentSessions(updated).length === 0 && pcFromInit?.payment_sessions?.length) {
      updated = mergePaymentSessionsOntoCart(
        { ...updated, payment_collection: { ...updated?.payment_collection, ...pcFromInit } },
        pcFromInit.payment_sessions,
      )
    }
    const sessions = cartPaymentSessions(updated)
    if (sessions.length === 0) {
      throw new Error('Payment sessions were not created')
    }
    return { cart: updated, selectedProviderId: sessionProviderId(sessions[0]) ?? pick.id }
  } catch (v2Err) {
    try {
      const { cart: withSessions } = await medusaClient.carts.createPaymentSessions(cart.id)
      const sessions = withSessions.payment_sessions ?? []
      if (sessions.length === 0) {
        throw v2Err
      }
      const manual = sessions.find((s) => s.provider_id === 'manual')
      const pick = manual ?? sessions[0]
      const { cart: afterSet } = await medusaClient.carts.setPaymentSession(withSessions.id, {
        provider_id: pick.provider_id,
      })
      return {
        cart: afterSet,
        selectedProviderId: pick.provider_id,
      }
    } catch {
      throw v2Err
    }
  }
}

export async function setCartPaymentProvider(cart, providerId) {
  if (!cart?.id || !providerId) throw new Error('Invalid cart or provider')

  const sdk = getMedusaV2Sdk()
  try {
    await sdk.store.payment.initiatePaymentSession(cart, {
      provider_id: providerId,
      data: {},
    })
    if (isCashPaymentProvider(providerId)) {
      await syncCashShippingZero(cart.id)
    }
    return retrieveCartWithPayment(sdk, cart.id)
  } catch (v2Err) {
    try {
      const { cart: updated } = await medusaClient.carts.setPaymentSession(cart.id, {
        provider_id: providerId,
      })
      return updated
    } catch {
      throw v2Err
    }
  }
}

/**
 * Complete cart — same route for v1/v2; prefer v2 SDK when publishable key is used.
 */
export async function completeStoreCart(cartId) {
  const sdk = getMedusaV2Sdk()
  try {
    return await sdk.store.cart.complete(cartId)
  } catch {
    return medusaClient.carts.complete(cartId)
  }
}

export function completeCartOrderPayload(result) {
  if (!result || result.type !== 'order') return null
  return result.order ?? result.data ?? null
}
