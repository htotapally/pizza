import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './auth-context.js'
import { getMedusaV2Sdk } from '../utils/medusaV2Sdk.js'

function transferGuestCartIfAny(sdk) {
  const cartId = localStorage.getItem('medusa_cart_id')
  if (!cartId) return Promise.resolve()
  return sdk.store.cart
    .transferCart(cartId)
    .then(() => {
      window.dispatchEvent(new CustomEvent('medusa-cart-updated', { detail: {} }))
    })
    .catch(() => {})
}

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(null)
  const [authInitializing, setAuthInitializing] = useState(true)

  const refreshCustomer = useCallback(async () => {
    const sdk = getMedusaV2Sdk()
    try {
      const { customer: next } = await sdk.store.customer.retrieve()
      setCustomer(next ?? null)
      return next ?? null
    } catch {
      setCustomer(null)
      return null
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      await refreshCustomer()
      if (!cancelled) setAuthInitializing(false)
    })()
    return () => {
      cancelled = true
    }
  }, [refreshCustomer])

  const login = useCallback(async (email, password) => {
    const sdk = getMedusaV2Sdk()
    const result = await sdk.auth.login('customer', 'emailpass', {
      email: email.trim(),
      password,
    })
    if (typeof result !== 'string' && result?.location) {
      throw new Error('This sign-in method requires completing authentication elsewhere.')
    }
    const { customer: next } = await sdk.store.customer.retrieve()
    setCustomer(next ?? null)
    await transferGuestCartIfAny(sdk)
    return next
  }, [])

  const register = useCallback(async ({ email, password, first_name, last_name }) => {
    const sdk = getMedusaV2Sdk()
    await sdk.auth.register('customer', 'emailpass', {
      email: email.trim(),
      password,
    })
    await sdk.store.customer.create({
      email: email.trim(),
      first_name: (first_name ?? '').trim() || 'Customer',
      last_name: (last_name ?? '').trim() || '',
    })
    const loginResult = await sdk.auth.login('customer', 'emailpass', {
      email: email.trim(),
      password,
    })
    if (typeof loginResult !== 'string' && loginResult?.location) {
      throw new Error('Account created but sign-in needs an extra step.')
    }
    const { customer: next } = await sdk.store.customer.retrieve()
    setCustomer(next ?? null)
    await transferGuestCartIfAny(sdk)
    return next
  }, [])

  const logout = useCallback(async () => {
    const sdk = getMedusaV2Sdk()
    await sdk.auth.logout()
    setCustomer(null)
  }, [])

  const value = useMemo(
    () => ({
      customer,
      authInitializing,
      login,
      logout,
      register,
      refreshCustomer,
    }),
    [customer, authInitializing, login, logout, register, refreshCustomer],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
