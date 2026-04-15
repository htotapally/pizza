/** Align with storefront / pizzaopizza.com contact block. */
export const CONTACT_ADDRESS = '25691 Smotherman rd, STE 180, Frisco, TX 75033'

export function getContactMapEmbedSrc() {
  const q = encodeURIComponent(CONTACT_ADDRESS)
  return `https://maps.google.com/maps?q=${q}&t=m&z=16&ie=UTF8&iwloc=near&output=embed`
}

export function getContactMapOpenUrl() {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT_ADDRESS)}`
}

/** Display like pizzaopizza.com: **Phone:** +1(214)830-7642 */
export const CONTACT_PHONE_DISPLAY_SITE = '+1(214)830-7642'
export const CONTACT_PHONE_TEL_DIGITS = '12148307642'

export const CONTACT_INTRO = "We're here to help and would love to hear from you!"

export const CONTACT_BODY =
  "For custom orders, or special events, feel free to get in touch. We're always ready to serve you a slice of happiness!"

/** Gallery row under contact — matches image strip on pizzaopizza.com. */
export const CONTACT_GALLERY_IMAGES = [
  { src: 'images/pizza/2-PizzaSpecial-WebMenuPage-583.jpg', alt: 'Gallery' },
  { src: 'images/pizza/583X356@2x-1.jpg', alt: 'Gallery' },
  { src: '/images/dallas_pizza.png', alt: 'Gallery' },
  { src: '/images/pizza.png', alt: 'Gallery' },
  { src: '/images/store_banner_frisco.jpg', alt: 'Gallery' },
  { src: '/images/store_banner_mckinney.jpg', alt: 'Gallery' },
  { src: 'images/pizza/2-PizzaSpecial-WebMenuPage-583.jpg', alt: 'Gallery' },
]
