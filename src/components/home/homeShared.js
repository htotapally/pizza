export const CARD_HOVER_CLASS =
  'transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl shadow-md'

export function formatHomeProductPrice(amount) {
  if (amount == null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}
