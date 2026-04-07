import React, { useEffect, useState } from 'react'
import { Link, useLocation, useMatch } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { medusaClient } from '../utils/client.js'
import { getCartItemCount } from '../utils/cart.js'

export default function NavHeader() {
  const location = useLocation()
  const menuActive = useMatch('/menu/*')
  const { customer, authInitializing, logout } = useAuth()
  const [cartCount, setCartCount] = useState(0)

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
    <header className="sticky top-0 z-50 bg-red-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-4 py-4">
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/images/dallas_pizza.png"
              alt="Dallas Pizza Logo"
              className="h-18 w-28 rounded-lg object-cover"
            />
            <div>
              <p className="text-xl font-bold text-white">Dallas Pizza</p>
              <p className="text-sm text-red-100">Premium Italian Cuisine</p>
            </div>
          </Link>

          <nav className="hidden items-center space-x-6 md:flex">
            <Link
              to="/menu/pizza"
              className={`transition-colors hover:text-red-200 ${menuActive ? 'font-semibold text-red-200' : 'text-white'}`}
            >
              MENU
            </Link>
            <Link to="/locations" className="text-white transition-colors hover:text-red-200">
              LOCATIONS
            </Link>            
            <a href="/#about" className="text-white transition-colors hover:text-red-200">
              ABOUT US
            </a>
            <a href="/#services" className="text-white transition-colors hover:text-red-200">
              Services
            </a>
            <a href="/#contact" className="text-white transition-colors hover:text-red-200">
              Contact
            </a>

          </nav>

          <div className="flex items-center space-x-3">
            <Link
              to="/cart"
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-600/80 bg-red-900/40 px-3 py-1.5 text-xs font-semibold text-red-50 transition-colors hover:bg-red-900/60"
              aria-label={`Shopping cart, ${cartCount} items`}
            >
              Cart
              <span className="rounded-md bg-white px-2 py-0.5 text-[0.7rem] font-bold text-red-800">
                {cartCount}
              </span>
            </Link>

            <a
              href="/#featured"
              className="hidden items-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-red-800 transition-colors hover:bg-gray-100 sm:inline-flex"
            >
              Shop Now
            </a>
            {authInitializing ? (
              <span className="rounded-lg px-4 py-2 text-sm text-red-200">…</span>
            ) : customer ? (
              <div className="flex items-center gap-2">
                <span
                  className="hidden max-w-[10rem] truncate text-sm text-red-100 sm:inline"
                  title={customer.email ?? ''}
                >
                  {customer.first_name?.trim()
                    ? `${customer.first_name}${customer.last_name ? ` ${customer.last_name}` : ''}`
                    : customer.email}
                </span>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="rounded-lg border border-red-400/80 bg-red-900/30 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-900/50"
                >
                  Log out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                state={{ from: location }}
                className="rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
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
