import { useEffect, useMemo, useState } from 'react'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { resolveStripePublishableKey } from '../utils/stripePublishableKey.js'

function mapStripeConfirmError(message) {
  if (
    typeof message === 'string' &&
    (message.includes('does not match any associated PaymentIntent') ||
      message.includes('same account that created the PaymentIntent'))
  ) {
    return (
      'Stripe account mismatch: Medusa’s STRIPE_API_KEY and the publishable key in the browser must be from the same Stripe account (Dashboard → Developers → API keys). Set STRIPE_PUBLISHABLE_KEY in Medusa to match STRIPE_API_KEY, or set VITE_STRIPE_PUBLISHABLE_KEY to that publishable key and restart Vite.'
    )
  }
  return message
}

function StripePayButton({ onPaid, onError, disabled }) {
  const stripe = useStripe()
  const elements = useElements()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements || disabled || submitting) return
    setSubmitting(true)
    onError('')
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/cart`,
        },
        redirect: 'if_required',
      })
      if (error) {
        onError(mapStripeConfirmError(error.message) ?? 'Payment could not be confirmed.')
        return
      }
      await onPaid()
    } catch (err) {
      onError(mapStripeConfirmError(err?.message) ?? 'Payment failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border border-gray-200 bg-white p-3">
        <PaymentElement />
      </div>
      <button
        type="submit"
        disabled={!stripe || disabled || submitting}
        className="w-full rounded-lg bg-[#635bff] px-6 py-3 text-center font-semibold text-white hover:bg-[#5851ea] disabled:opacity-50"
      >
        {submitting ? 'Processing…' : 'Pay and place order'}
      </button>
    </form>
  )
}

/**
 * Stripe Payment Element for Medusa v2 (`client_secret` on payment session `data`).
 * Publishable key comes from `VITE_STRIPE_PUBLISHABLE_KEY` or Medusa `GET /store/stripe-publishable-key`
 * (backed by `STRIPE_PUBLISHABLE_KEY` — must be the same Stripe account as `STRIPE_API_KEY`).
 */
export default function StripePaymentForm({ clientSecret, onPaid, onError, disabled }) {
  const [publishableKey, setPublishableKey] = useState(null)
  const [keyError, setKeyError] = useState('')
  const [keyLoading, setKeyLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setKeyLoading(true)
    setKeyError('')
    ;(async () => {
      try {
        const key = await resolveStripePublishableKey()
        if (cancelled) return
        if (!key) {
          setKeyError(
            'Set VITE_STRIPE_PUBLISHABLE_KEY in the storefront .env, or STRIPE_PUBLISHABLE_KEY in Medusa (same Stripe account as STRIPE_API_KEY).',
          )
          setPublishableKey(null)
        } else {
          setPublishableKey(key)
        }
      } catch (e) {
        if (!cancelled) {
          setKeyError(e?.message || 'Could not resolve Stripe publishable key.')
          setPublishableKey(null)
        }
      } finally {
        if (!cancelled) setKeyLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const stripePromise = useMemo(
    () => (publishableKey ? loadStripe(publishableKey) : null),
    [publishableKey],
  )

  if (keyLoading) {
    return (
      <p className="text-sm text-gray-500" role="status">
        Loading Stripe…
      </p>
    )
  }

  if (keyError || !publishableKey || !stripePromise) {
    return (
      <p className="text-sm text-amber-800" role="alert">
        {keyError ||
          'Configure Stripe: use STRIPE_API_KEY and STRIPE_PUBLISHABLE_KEY from the same account in Medusa, or VITE_STRIPE_PUBLISHABLE_KEY matching STRIPE_API_KEY.'}
      </p>
    )
  }

  if (!clientSecret) {
    return (
      <p className="text-sm text-gray-500">
        Preparing Stripe… If this persists, switch payment method and back, or refresh the page.
      </p>
    )
  }

  return (
    <Elements
      key={`${publishableKey}:${clientSecret}`}
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#b91c1c',
          },
        },
      }}
    >
      <StripePayButton onPaid={onPaid} onError={onError} disabled={disabled} />
    </Elements>
  )
}
