import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { medusaClient } from '../utils/client.js'
import {
  formatMoney,
  getCartItemCount,
  lineItemImageUrl,
  lineItemTitle,
} from '../utils/cart.js'
import {
  getCartShippingDiagnostics,
  listCartShippingOptions,
} from '../utils/shippingOptions.js'
import { updateCartCheckout } from '../utils/checkoutCart.js'
import StripePaymentForm from '../components/StripePaymentForm.jsx'
import {
  cartPaymentSessions,
  completeCartOrderPayload,
  completeStoreCart,
  getPaymentSessionClientSecret,
  isCashPaymentProvider,
  isStripePaymentProvider,
  prepareCartPayment,
  sessionProviderId,
  setCartPaymentProvider,
} from '../utils/paymentCheckout.js'

function notifyCartUpdated(cart) {
  window.dispatchEvent(new CustomEvent('medusa-cart-updated', { detail: { cart } }))
}

/** Must match a country in your Medusa region (seed default is EU — e.g. dk). US will not work on a EU-only region. */
const DEFAULT_COUNTRY =
  import.meta.env.VITE_DEFAULT_COUNTRY_CODE?.trim().toLowerCase() || 'dk'
const PICKUP_COUNTRY =
  import.meta.env.VITE_PICKUP_COUNTRY_CODE?.trim().toLowerCase() || DEFAULT_COUNTRY

const DEFAULT_ADDRESS = {
  email: '',
  first_name: '',
  last_name: '',
  phone: '',
  address_1: '',
  address_2: '',
  city: '',
  province: '',
  postal_code: '',
  country_code: DEFAULT_COUNTRY,
}

function addressPayload(form) {
  return {
    first_name: form.first_name.trim(),
    last_name: form.last_name.trim(),
    phone: form.phone.trim() || undefined,
    address_1: form.address_1.trim(),
    address_2: form.address_2.trim() || undefined,
    city: form.city.trim(),
    province: form.province.trim(),
    postal_code: form.postal_code.trim(),
    country_code: form.country_code.trim().toLowerCase(),
  }
}

export default function Cart() {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(DEFAULT_ADDRESS)
  const [shippingOptions, setShippingOptions] = useState([])
  const [selectedShippingId, setSelectedShippingId] = useState('')
  const [paymentProviderId, setPaymentProviderId] = useState('')
  const [checkoutPhase, setCheckoutPhase] = useState('idle')
  /** `delivery` = full address; `pickup` = minimal country for “Pickup — pay with cash” + cash payment. */
  const [checkoutMode, setCheckoutMode] = useState('delivery')
  const [checkoutError, setCheckoutError] = useState('')
  const [busy, setBusy] = useState(false)
  const [lineBusyId, setLineBusyId] = useState(null)
  const [completedOrder, setCompletedOrder] = useState(null)
  const [pickupReadyAt, setPickupReadyAt] = useState(null)

  const applyCart = useCallback((next) => {
    setCart(next ?? null)
    notifyCartUpdated(next ?? null)
  }, [])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      const id = localStorage.getItem('medusa_cart_id')
      if (!id) {
        if (!cancelled) {
          setCart(null)
          setLoading(false)
        }
        return
      }
      try {
        const { cart: next } = await medusaClient.carts.retrieve(id)
        if (!cancelled) setCart(next ?? null)
      } catch {
        if (!cancelled) setCart(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    const onUpdate = (e) => {
      if (e.detail?.cart !== undefined) {
        setCart(e.detail.cart ?? null)
      } else {
        load()
      }
    }
    window.addEventListener('medusa-cart-updated', onUpdate)
    return () => {
      cancelled = true
      window.removeEventListener('medusa-cart-updated', onUpdate)
    }
  }, [])

  useEffect(() => {
    if (!cart?.id) return
    const a = cart.shipping_address
    setForm((prev) => ({
      ...prev,
      email: cart.email ?? prev.email,
      first_name: a?.first_name ?? prev.first_name,
      last_name: a?.last_name ?? prev.last_name,
      phone: a?.phone ?? prev.phone,
      address_1: a?.address_1 ?? prev.address_1,
      address_2: a?.address_2 ?? prev.address_2,
      city: a?.city ?? prev.city,
      province: a?.province ?? prev.province,
      postal_code: a?.postal_code ?? prev.postal_code,
      country_code: (a?.country_code ?? prev.country_code).toLowerCase(),
    }))
    const methods = cart.shipping_methods ?? []
    if (methods.length === 1 && methods[0].shipping_option_id) {
      setSelectedShippingId(methods[0].shipping_option_id)
    }
    const sessions = cartPaymentSessions(cart)
    const selected = sessions.find((s) => s.is_selected) ?? sessions[0]
    const pid = sessionProviderId(selected)
    if (pid) setPaymentProviderId(pid)
  }, [cart?.id])

  useEffect(() => {
    if (checkoutMode === 'pickup') {
      setPickupReadyAt(new Date(Date.now() + 15 * 60 * 1000))
    }
  }, [checkoutMode])

  const items = cart?.items ?? []
  const count = getCartItemCount(cart)
  const subtotal = cart?.subtotal
  const shippingTotal = cart?.shipping_total
  const taxTotal = cart?.tax_total
  const total = cart?.total
  const currency = cart?.currency_code ?? cart?.region?.currency_code ?? 'usd'
  const paymentSessionsList = cartPaymentSessions(cart)
  const stripeSelected = isStripePaymentProvider(paymentProviderId)
  const selectedPaymentSession = paymentSessionsList.find(
    (s) => sessionProviderId(s) === paymentProviderId,
  )
  const stripeClientSecret = getPaymentSessionClientSecret(selectedPaymentSession)
  const pickupReadyLabel =
    pickupReadyAt != null
      ? pickupReadyAt.toLocaleString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        })
      : ''

  /** If filled, must look like an email; empty is allowed. */
  const validateEmailIfPresent = () => {
    const e = form.email.trim()
    if (!e) return ''
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return 'Enter a valid email.'
    return ''
  }

  const validateDeliveryContact = () => {
    const emailErr = validateEmailIfPresent()
    if (emailErr) return emailErr
    if (!form.first_name.trim() || !form.last_name.trim()) return 'First and last name are required.'
    if (!form.address_1.trim() || !form.city.trim()) return 'Street address and city are required.'
    if (!form.postal_code.trim()) return 'Postal code is required.'
    if (!form.country_code.trim()) return 'Country is required.'
    return ''
  }

  const handleLoadShippingOptions = async () => {
    const err = validateDeliveryContact()
    if (err) {
      setCheckoutError(err)
      return
    }
    if (!cart?.id) return
    setCheckoutError('')
    setBusy(true)
    setCheckoutPhase('idle')
    try {
      const ship = addressPayload(form)
      const updated = await updateCartCheckout(cart.id, {
        email: form.email.trim() || undefined,
        shipping_address: ship,
        billing_address: ship,
      })
      applyCart(updated)
      const { shipping_options } = await listCartShippingOptions(updated.id)
      const opts = shipping_options ?? []
      setShippingOptions(opts)
      if (opts.length === 0) {
        const diag = await getCartShippingDiagnostics(updated.id)
        let msg =
          'No shipping methods were returned. In Medusa Admin: link stock locations to your sales channel, assign inventory to variants, and add shipping options for this region. If you changed .env, start a new cart.'
        if (diag && !diag.sales_channel_id) {
          msg =
            'This cart has no sales channel. Set VITE_MEDUSA_SALES_CHANNEL_ID in .env to your publishable key’s sales channel (sc_…), restart the dev server, and create a new cart.'
        } else if (diag && diag.line_item_count === 0) {
          msg = 'Your cart has no line items; add products before shipping options can be evaluated.'
        }
        setCheckoutError(msg)
      } else {
        setCheckoutPhase('shipping')
        const first = opts[0]
        setSelectedShippingId(first.id)
        const { cart: withShip } = await medusaClient.carts.addShippingMethod(updated.id, {
          option_id: first.id,
        })
        applyCart(withShip)
      }
    } catch (e) {
      setCheckoutError(e?.message || 'Could not save address or load shipping options.')
    } finally {
      setBusy(false)
    }
  }

  const handleShippingChange = async (optionId) => {
    if (!cart?.id || !optionId) return
    setSelectedShippingId(optionId)
    setCheckoutError('')
    setBusy(true)
    try {
      const { cart: updated } = await medusaClient.carts.addShippingMethod(cart.id, {
        option_id: optionId,
      })
      applyCart(updated)
    } catch (e) {
      setCheckoutError(e?.message || 'Could not set shipping method.')
    } finally {
      setBusy(false)
    }
  }

  const handlePreparePayment = async () => {
    if (!cart?.id || !selectedShippingId) {
      setCheckoutError('Choose a shipping method first.')
      return
    }
    setCheckoutError('')
    setBusy(true)
    try {
      const { cart: afterSet, selectedProviderId } = await prepareCartPayment(cart, {
        preferCash: checkoutMode === 'pickup',
      })
      applyCart(afterSet)
      const sessions = cartPaymentSessions(afterSet)
      if (sessions.length === 0) {
        setCheckoutError('No payment providers are configured for this region.')
        setBusy(false)
        return
      }
      setPaymentProviderId(selectedProviderId || sessionProviderId(sessions[0]))
      setCheckoutPhase('payment')
    } catch (e) {
      setCheckoutError(e?.message || 'Could not start payment.')
    } finally {
      setBusy(false)
    }
  }

  const handlePaymentProviderChange = async (providerId) => {
    if (!cart?.id || !providerId) return
    setPaymentProviderId(providerId)
    setBusy(true)
    try {
      const updated = await setCartPaymentProvider(cart, providerId)
      applyCart(updated)
    } catch (e) {
      setCheckoutError(e?.message || 'Could not select payment method.')
    } finally {
      setBusy(false)
    }
  }

  const handleLineQuantityDelta = async (item, delta) => {
    if (!cart?.id || lineBusyId) return
    const current = item.quantity ?? 0
    const next = current + delta
    if (next < 0) return
    setLineBusyId(item.id)
    setCheckoutError('')
    try {
      if (next <= 0) {
        const { cart: updated } = await medusaClient.carts.lineItems.delete(cart.id, item.id)
        applyCart(updated)
      } else {
        const { cart: updated } = await medusaClient.carts.lineItems.update(cart.id, item.id, {
          quantity: next,
        })
        applyCart(updated)
      }
    } catch (e) {
      setCheckoutError(e?.message || 'Could not update cart.')
    } finally {
      setLineBusyId(null)
    }
  }

  const applyCompletedOrder = (result) => {
    const order = completeCartOrderPayload(result)
    if (order) {
      setCompletedOrder(order)
      localStorage.removeItem('medusa_cart_id')
      notifyCartUpdated(null)
      setCart(null)
      setCheckoutPhase('done')
      return true
    }
    if (result?.type === 'cart') {
      const msg =
        typeof result.error === 'string'
          ? result.error
          : result.error?.message || result.error?.toString?.()
      setCheckoutError(
        msg ||
          'Payment needs another step (for example card authentication), or the cart could not be completed.',
      )
      return false
    }
    setCheckoutError('Checkout could not be completed.')
    return false
  }

  const handleStripeOrderComplete = async () => {
    if (!cart?.id) return
    setCheckoutError('')
    const result = await completeStoreCart(cart.id)
    applyCompletedOrder(result)
  }

  const handlePickupPlaceOrder = async () => {
    const emailErr = validateEmailIfPresent()
    if (emailErr) {
      setCheckoutError(emailErr)
      return
    }
    if (!cart?.id) return
    setCheckoutError('')
    setBusy(true)
    try {
      const ship = { country_code: PICKUP_COUNTRY }
      let updated = await updateCartCheckout(cart.id, {
        email: form.email.trim() || undefined,
        shipping_address: ship,
        billing_address: ship,
      })
      applyCart(updated)

      const { shipping_options } = await listCartShippingOptions(updated.id)
      const opts = shipping_options ?? []
      if (opts.length === 0) {
        const diag = await getCartShippingDiagnostics(updated.id)
        let msg =
          'No shipping methods were returned. In Medusa Admin: link stock locations to your sales channel, assign inventory to variants, and add shipping options for this region. If you changed .env, start a new cart.'
        if (diag && !diag.sales_channel_id) {
          msg =
            'This cart has no sales channel. Set VITE_MEDUSA_SALES_CHANNEL_ID in .env to your publishable key’s sales channel (sc_…), restart the dev server, and create a new cart.'
        } else if (diag && diag.line_item_count === 0) {
          msg = 'Your cart has no line items; add products before shipping options can be evaluated.'
        }
        setCheckoutError(msg)
        return
      }

      const pickupOpt =
        opts.find((o) => /pickup/i.test(o.name ?? '')) ??
        opts.find((o) => (o.amount ?? 0) === 0) ??
        opts[0]

      const { cart: withShip } = await medusaClient.carts.addShippingMethod(updated.id, {
        option_id: pickupOpt.id,
      })
      updated = withShip
      applyCart(updated)

      const { cart: afterPay } = await prepareCartPayment(updated, { preferCash: true })
      applyCart(afterPay)

      let finalCart = afterPay
      const sessions = cartPaymentSessions(afterPay)
      const selectedPid = sessionProviderId(
        sessions.find((s) => s.is_selected) ?? sessions[0],
      )
      const cashSession = sessions.find((s) => isCashPaymentProvider(sessionProviderId(s)))
      if (cashSession && !isCashPaymentProvider(selectedPid)) {
        finalCart = await setCartPaymentProvider(afterPay, sessionProviderId(cashSession))
        applyCart(finalCart)
      }

      const result = await completeStoreCart(finalCart.id)
      applyCompletedOrder(result)
    } catch (e) {
      setCheckoutError(e?.message || 'Could not place pickup order.')
    } finally {
      setBusy(false)
    }
  }

  const handlePlaceOrder = async () => {
    if (!cart?.id) return
    if (!paymentProviderId) {
      setCheckoutError('Select a payment method first.')
      return
    }
    if (stripeSelected) {
      setCheckoutError('Use the Stripe card form below to pay and place your order.')
      return
    }
    setCheckoutError('')
    setBusy(true)
    try {
      const result = await completeStoreCart(cart.id)
      applyCompletedOrder(result)
    } catch (e) {
      setCheckoutError(e?.message || 'Order failed.')
    } finally {
      setBusy(false)
    }
  }

  if (completedOrder) {
    const displayId = completedOrder.display_id ?? completedOrder.id
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-green-800">Order placed</p>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">Thank you!</h1>
          <p className="mt-2 text-gray-700">
            Your order reference is <span className="font-mono font-semibold">#{displayId}</span>.
          </p>
          <p className="mt-4 text-sm text-gray-600">
            We will send a confirmation to {form.email || 'your email'}.
          </p>
          <Link
            to="/#featured"
            className="mt-8 inline-flex rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Your cart</h1>
        <Link
          to="/#featured"
          className="text-sm font-semibold text-red-700 hover:text-red-900"
        >
          ← Continue shopping
        </Link>
      </div>

      {loading && (
        <p className="text-gray-600" role="status">
          Loading cart…
        </p>
      )}

      {!loading && count === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg text-gray-600">Your cart is empty.</p>
          <Link
            to="/#featured"
            className="mt-6 inline-flex rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
          >
            Browse products
          </Link>
        </div>
      )}

      {!loading && count > 0 && (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <div className="space-y-6">
            <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 bg-gray-50 px-4 py-3 sm:px-6">
                <h2 className="text-lg font-semibold text-gray-900">Items</h2>
              </div>
              <ul className="divide-y divide-gray-100">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4 px-4 py-5 sm:px-6">
                    <img
                      src={lineItemImageUrl(item)}
                      alt=""
                      className="h-20 w-20 shrink-0 rounded-lg border border-gray-100 bg-gray-50 object-contain p-2"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900">{lineItemTitle(item)}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="text-sm text-gray-500">Qty</span>
                        <div className="inline-flex items-center rounded-lg border border-gray-200 bg-gray-50">
                          <button
                            type="button"
                            disabled={busy || lineBusyId === item.id}
                            onClick={() => handleLineQuantityDelta(item, -1)}
                            className="px-3 py-1.5 text-lg leading-none text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="min-w-[2rem] px-2 text-center text-sm font-medium tabular-nums text-gray-900">
                            {item.quantity ?? 0}
                          </span>
                          <button
                            type="button"
                            disabled={busy || lineBusyId === item.id}
                            onClick={() => handleLineQuantityDelta(item, 1)}
                            className="px-3 py-1.5 text-lg leading-none text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <p className="mt-2 text-base font-bold text-red-700">
                        {formatMoney(
                          item.total ?? item.subtotal ?? item.unit_price * (item.quantity ?? 1),
                          currency,
                        )}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900">Checkout type</h2>
              <p className="mt-1 text-sm text-gray-500">
                Delivery ships to your address. Store pickup uses cash in store; we confirm a ready time below.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 p-3 has-[:checked]:border-red-400 has-[:checked]:bg-red-50">
                  <input
                    type="radio"
                    name="checkout-mode"
                    checked={checkoutMode === 'delivery'}
                    onChange={() => {
                      setCheckoutMode('delivery')
                      setCheckoutPhase('idle')
                      setShippingOptions([])
                    }}
                  />
                  <span className="font-medium text-gray-900">Delivery (ship to address)</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 p-3 has-[:checked]:border-red-400 has-[:checked]:bg-red-50">
                  <input
                    type="radio"
                    name="checkout-mode"
                    checked={checkoutMode === 'pickup'}
                    onChange={() => {
                      setCheckoutMode('pickup')
                      setCheckoutPhase('idle')
                      setShippingOptions([])
                    }}
                  />
                  <span className="font-medium text-gray-900">Store pickup (cash)</span>
                </label>
              </div>
            </section>

            {checkoutMode === 'delivery' && (
              <>
            <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900">Contact</h2>
              <label className="mt-4 block text-sm font-medium text-gray-700" htmlFor="checkout-email">
                Email <span className="font-normal text-gray-500">(optional)</span>
              </label>
              <input
                id="checkout-email"
                type="email"
                autoComplete="email"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900">Delivery address</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="fn">
                    First name
                  </label>
                  <input
                    id="fn"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                    value={form.first_name}
                    onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="ln">
                    Last name
                  </label>
                  <input
                    id="ln"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                    value={form.last_name}
                    onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
                  />
                </div>
              </div>
              <label className="mt-4 block text-sm font-medium text-gray-700" htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              />
              <label className="mt-4 block text-sm font-medium text-gray-700" htmlFor="a1">
                Address line 1
              </label>
              <input
                id="a1"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                value={form.address_1}
                onChange={(e) => setForm((f) => ({ ...f, address_1: e.target.value }))}
              />
              <label className="mt-4 block text-sm font-medium text-gray-700" htmlFor="a2">
                Address line 2 (optional)
              </label>
              <input
                id="a2"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                value={form.address_2}
                onChange={(e) => setForm((f) => ({ ...f, address_2: e.target.value }))}
              />
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="city">
                    City
                  </label>
                  <input
                    id="city"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="prov">
                    State / province
                  </label>
                  <input
                    id="prov"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                    value={form.province}
                    onChange={(e) => setForm((f) => ({ ...f, province: e.target.value }))}
                  />
                </div>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="zip">
                    Postal code
                  </label>
                  <input
                    id="zip"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                    value={form.postal_code}
                    onChange={(e) => setForm((f) => ({ ...f, postal_code: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="cc">
                    Country code
                  </label>
                  <input
                    id="cc"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                    value={form.country_code}
                    onChange={(e) => setForm((f) => ({ ...f, country_code: e.target.value }))}
                    placeholder="us"
                  />
                </div>
              </div>
              <button
                type="button"
                disabled={busy}
                onClick={handleLoadShippingOptions}
                className="mt-6 w-full rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-800 hover:bg-red-100 disabled:opacity-50 sm:w-auto"
              >
                {busy ? 'Working…' : 'Save address & get shipping rates'}
              </button>
            </section>
              </>
            )}

            {checkoutMode === 'pickup' && (
              <section className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 shadow-sm sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900">Store pickup</h2>
                <p className="mt-2 text-gray-700">
                  Your order will be ready in <span className="font-semibold">15 minutes</span>.
                </p>
                <p className="mt-3 text-sm text-gray-600">Estimated ready time</p>
                <p className="mt-1 text-xl font-semibold text-emerald-900 tabular-nums">{pickupReadyLabel}</p>
                <label className="mt-6 block text-sm font-medium text-gray-700" htmlFor="pickup-email">
                  Email <span className="font-normal text-gray-500">(optional)</span>
                </label>
                <input
                  id="pickup-email"
                  type="email"
                  autoComplete="email"
                  className="mt-1 w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
                <button
                  type="button"
                  disabled={busy}
                  onClick={handlePickupPlaceOrder}
                  className="mt-6 w-full rounded-lg bg-emerald-700 px-6 py-3 text-center font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 sm:w-auto"
                >
                  {busy ? 'Placing order…' : 'Place order'}
                </button>
              </section>
            )}

            {checkoutMode === 'delivery' && shippingOptions.length > 0 && (
              <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900">Shipping method</h2>
                <p className="mt-1 text-sm text-gray-500">Choose how you would like your order delivered.</p>
                <ul className="mt-4 space-y-3">
                  {shippingOptions.map((opt) => (
                    <li key={opt.id}>
                      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-3 has-[:checked]:border-red-300 has-[:checked]:bg-red-50/50">
                        <input
                          type="radio"
                          name="shipping-option"
                          className="mt-1"
                          checked={selectedShippingId === opt.id}
                          onChange={() => handleShippingChange(opt.id)}
                        />
                        <span className="flex-1">
                          <span className="font-medium text-gray-900">{opt.name ?? 'Shipping'}</span>
                          {opt.amount != null && (
                            <span className="ml-2 text-red-700">{formatMoney(opt.amount, currency)}</span>
                          )}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  disabled={busy || !selectedShippingId}
                  onClick={handlePreparePayment}
                  className="mt-6 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 disabled:opacity-50 sm:w-auto"
                >
                  {busy ? 'Working…' : 'Continue to payment'}
                </button>
              </section>
            )}

            {checkoutMode === 'delivery' && checkoutPhase === 'payment' && paymentSessionsList.length > 0 && (
              <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900">Payment</h2>
                <p className="mt-1 text-sm text-gray-500">Select how you will pay.</p>
                <ul className="mt-4 space-y-3">
                  {paymentSessionsList.map((session) => {
                    const pid = sessionProviderId(session)
                    const label = pid
                      ? pid.replace(/_/g, ' ')
                      : 'Payment'
                    const pretty = isStripePaymentProvider(pid)
                      ? `${label} (card)`
                      : isCashPaymentProvider(pid)
                        ? 'Cash (pay in store)'
                        : label
                    return (
                      <li key={session.id ?? pid}>
                        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3 has-[:checked]:border-green-300 has-[:checked]:bg-green-50/50">
                          <input
                            type="radio"
                            name="pay"
                            checked={paymentProviderId === pid}
                            onChange={() => handlePaymentProviderChange(pid)}
                          />
                          <span className="font-medium capitalize text-gray-900">{pretty}</span>
                        </label>
                      </li>
                    )
                  })}
                </ul>
                {stripeSelected && (
                  <div className="mt-6 border-t border-gray-100 pt-6">
                    <h3 className="text-base font-semibold text-gray-900">Card details</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Secured by Stripe. Your card is charged when you complete payment.
                    </p>
                    <div className="mt-4">
                      <StripePaymentForm
                        clientSecret={stripeClientSecret}
                        onPaid={handleStripeOrderComplete}
                        onError={setCheckoutError}
                        disabled={busy}
                      />
                    </div>
                  </div>
                )}
              </section>
            )}

            {checkoutError && (
              <div
                className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
                role="alert"
              >
                {checkoutError}
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-24">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900">Order summary</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <dt>Subtotal</dt>
                  <dd className="font-medium text-gray-900">{formatMoney(subtotal, currency)}</dd>
                </div>
                <div className="flex justify-between text-gray-600">
                  <dt>Shipping</dt>
                  <dd className="font-medium text-gray-900">
                    {shippingTotal != null ? formatMoney(shippingTotal, currency) : '—'}
                  </dd>
                </div>
                <div className="flex justify-between text-gray-600">
                  <dt>Tax</dt>
                  <dd className="font-medium text-gray-900">
                    {taxTotal != null ? formatMoney(taxTotal, currency) : '—'}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-semibold text-gray-900">
                  <dt>Total</dt>
                  <dd className="text-red-700">{total != null ? formatMoney(total, currency) : '—'}</dd>
                </div>
              </dl>
              {checkoutMode === 'delivery' && checkoutPhase === 'payment' && paymentProviderId && !stripeSelected && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={handlePlaceOrder}
                  className="mt-6 w-full rounded-lg bg-green-600 px-6 py-3 text-center font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {busy ? 'Placing order…' : 'Place order'}
                </button>
              )}
              {checkoutMode === 'delivery' && checkoutPhase === 'payment' && stripeSelected && (
                <p className="mt-4 text-xs text-gray-500">
                  Complete payment with the Stripe form in the Payment section.
                </p>
              )}
              {checkoutMode === 'delivery' && checkoutPhase !== 'payment' && (
                <p className="mt-4 text-xs text-gray-500">
                  Enter your details and load shipping rates to continue checkout.
                </p>
              )}
              {checkoutMode === 'pickup' && (
                <p className="mt-4 text-xs text-gray-500">
                  Pay with cash when you pick up. Totals update after you place an order.
                </p>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
