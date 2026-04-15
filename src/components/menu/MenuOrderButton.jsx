import React from 'react'

export default function MenuOrderButton({ className = '' }) {
  return (
    <a
      href="/#featured"
      className={`inline-flex items-center justify-center rounded-lg bg-red-800 px-5 py-2.5 text-sm font-semibold text-white shadow transition-colors hover:bg-red-900 ${className}`}
    >
      Order now
    </a>
  )
}
