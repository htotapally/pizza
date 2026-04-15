import React, { useEffect, useState } from 'react'
import { Link, useLocation, useMatch } from 'react-router-dom'
import { useAuth } from '../../context/useAuth.js'
import { medusaClient } from '../../utils/client.js'
import { getCartItemCount } from '../../utils/cart.js'

function navClass(active) {
  return active
    ? 'font-semibold text-red-200 underline decoration-red-200/80 underline-offset-4'
    : 'text-white transition-colors hover:text-red-200'
}

export default function NavHeader() {
  const location = useLocation()
  const menuActive = useMatch('/menu/*')
  const contactActive = useMatch('/contact')
  const aboutActive = useMatch('/about')
  const { customer, authInitializing, logout } = useAuth()
  const [cartCount, setCartCount] = useState(0)

  const path = location.pathname
  const homeActive = path === '/'

  useEffect(() => {
    let cancelled = false

    const refreshCount = async () => {
      const id = localStorage.getItem('medusa_cart_id')
      if (!id) {
        if (!cancelled) setCartCount(0)
        return
      }
      try {
        const { cart } = await medusaClient.carts.retrieve(id)
        if (!cancelled) setCartCount(getCartItemCount(cart))
      } catch {
        if (!cancelled) setCartCount(0)
      }
    }

    refreshCount()

    const onUpdate = (e) => {
      if (e.detail?.cart) {
        setCartCount(getCartItemCount(e.detail.cart))
      } else {
        refreshCount()
      }
    }
    window.addEventListener('medusa-cart-updated', onUpdate)
    return () => {
      cancelled = true
      window.removeEventListener('medusa-cart-updated', onUpdate)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-red-900/30 bg-red-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex flex-nowrap items-center justify-between gap-2 py-3 sm:gap-3 md:gap-4 md:py-4">
          <Link to="/" className="flex shrink-0 items-center">
            <img
              src="/images/pizza/foodex_logo-1-removebg-preview.png"
              alt="Pizza O Pizza Logo"
              className="h-12 w-auto max-w-[200px] object-contain object-left sm:h-14 md:h-16 md:max-w-[240px]"
            />
          </Link>

          <nav
            className="flex min-w-0 flex-1 items-center justify-center gap-3 text-xs font-semibold uppercase tracking-wide text-white sm:gap-5 sm:text-sm md:gap-8 md:text-[0.8125rem]"
            aria-label="Primary"
          >
            <Link to="/" className={navClass(homeActive)}>
              Home
            </Link>
            <Link to="/menu/pizza" className={navClass(!!menuActive)}>
              Menu
            </Link>
            <Link to="/about" className={navClass(!!aboutActive)}>
              About Us
            </Link>
            <Link to="/contact" className={navClass(!!contactActive)}>
              Contact
            </Link>
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              to="/cart"
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-600/80 bg-red-900/40 px-2.5 py-1.5 text-xs font-semibold text-red-50 transition-colors hover:bg-red-900/60 sm:px-3"
              aria-label={`Shopping cart, ${cartCount} items`}
            >
              Cart
              <span className="rounded-md bg-white px-2 py-0.5 text-[0.7rem] font-bold text-red-800">{cartCount}</span>
            </Link>

            {authInitializing ? (
              <span className="rounded-lg px-2 py-2 text-sm text-red-200 sm:px-4">…</span>
            ) : customer ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <span
                  className="hidden max-w-[8rem] truncate text-xs text-red-100 lg:inline lg:max-w-[10rem] lg:text-sm"
                  title={customer.email ?? ''}
                >
                  {customer.first_name?.trim()
                    ? `${customer.first_name}${customer.last_name ? ` ${customer.last_name}` : ''}`
                    : customer.email}
                </span>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="rounded-lg border border-red-400/80 bg-red-900/30 px-2 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-900/50 sm:px-3 sm:text-sm"
                >
                  Log out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                state={{ from: location }}
                className="rounded-lg bg-red-700 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-red-600 sm:px-4 sm:text-sm"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
