/**
 * Menu category tabs are loaded from Medusa Store API (`/store/product-categories`).
 * Static copy below (`pizzaMenu`, `categoryItems`) still powers page bodies where present.
 */

import { getMedusaV2Sdk } from '../utils/medusaV2Sdk.js'
import { getMedusaBaseUrl } from '../utils/medusaBaseUrl.js'

const MENU_PRODUCT_FALLBACK_IMAGE = '/images/pizza.png'

/** Align with `Home.jsx` / `ProductDetail.jsx`; override via `VITE_MEDUSA_REGION_ID`. */
function getStoreRegionId() {
  return import.meta.env.VITE_MEDUSA_REGION_ID?.trim() || 'reg_01KN4JM1SKHY8BXNRSRQ4RMDWY'
}

function formatStorePrice(amount, currencyCode = 'usd') {
  if (amount == null || Number.isNaN(Number(amount))) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: String(currencyCode).toUpperCase(),
  }).format(Number(amount) / 100)
}

function priceLabelFromStoreProduct(product) {
  const cp = product?.variants?.[0]?.calculated_price
  return formatStorePrice(cp?.calculated_amount, cp?.currency_code)
}

/**
 * Thumbnail or first gallery image; absolute URLs unchanged, relative paths joined to Medusa base.
 */
function productImageUrl(product) {
  const thumb = typeof product?.thumbnail === 'string' ? product.thumbnail.trim() : ''
  const firstImg =
    Array.isArray(product?.images) && product.images.length > 0
      ? String(product.images[0]?.url ?? '').trim()
      : ''
  const raw = thumb || firstImg
  if (!raw) return MENU_PRODUCT_FALLBACK_IMAGE
  if (/^https?:\/\//i.test(raw)) return raw
  const base = getMedusaBaseUrl().replace(/\/$/, '')
  return `${base}${raw.startsWith('/') ? raw : `/${raw}`}`
}

function slugFromCategory(cat) {
  const h = typeof cat.handle === 'string' ? cat.handle.trim() : ''
  if (h) return h
  return String(cat.name ?? 'category')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '') || 'category'
}

/**
 * Active top-level product categories from the backend, ordered by rank then name.
 * @returns {Promise<{ id: string, slug: string, label: string }[]>}
 */
export async function fetchMenuCategories() {
  const sdk = getMedusaV2Sdk()
  const { product_categories: rows = [] } = await sdk.store.category.list({
    limit: 100,
    offset: 0,
    fields: 'id,name,handle,rank,parent_category_id,is_active',
  })
  const topLevel = rows.filter((c) => c.is_active && c.parent_category_id == null)
  topLevel.sort((a, b) => {
    const ra = a.rank ?? 0
    const rb = b.rank ?? 0
    if (ra !== rb) return ra - rb
    return String(a.name ?? '').localeCompare(String(b.name ?? ''))
  })
  return topLevel.map((c) => ({
    id: c.id,
    slug: slugFromCategory(c),
    label: c.name ?? slugFromCategory(c),
  }))
}

export const pizzaMenu = {
  intro:
    'Dallas Pizza is not your typical neighborhood pizza place. We bring authentic, handcrafted Italian-inspired flavors to everything we do.',
  orderNote: 'Start your order to see prices, deals, and items available in your area.',
  buildYourOwn: {
    title: 'Build your own',
    /** Shown when no BYO products are returned from Medusa (collection handle `byo`). */
    bodyFallback:
      'Made fresh daily — choose from our traditional, thin, stuffed, Neapolitan, cauliflower, or gluten-free crust. Your pizza masterpiece awaits.',
    footnote: 'Crust options and allergens vary by location.',
  },
  artisanIntro:
    'Feast your eyes — our handcrafted artisan pizzas are loaded with fresh, high-quality ingredients.',
}

/** Match Medusa category handle/name `pizza` (see artisan / BYO product fetchers). */
export const ARTISAN_PIZZA_CATEGORY_HANDLE = 'pizza'
export const ARTISAN_PIZZA_COLLECTION_TITLE = 'Artisan Pizza'
/** Collection handle for build-your-own products (with pizza category). */
export const BUILD_YOUR_OWN_COLLECTION_HANDLE = 'byo'
/** Pizza page “Featured deals” strip — products in this collection (match title or handle). */
export const FEATURED_DEALS_COLLECTION_TITLE = 'Featured Deals'

function plainProductDescription(raw) {
  if (raw == null || typeof raw !== 'string') return '—'
  const t = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return t || '—'
}

function dealBadgeFromMetadata(metadata) {
  if (!metadata || typeof metadata !== 'object') return undefined
  const b = metadata.badge ?? metadata.deal_badge
  return typeof b === 'string' && b.trim() ? b.trim() : undefined
}

/**
 * Products in collection titled `Featured Deals` (Store API: collection_id).
 * @returns {Promise<{ id: string, title: string, price: string, description: string, imageUrl: string, badge?: string }[]>}
 */
export async function fetchFeaturedDeals() {
  const sdk = getMedusaV2Sdk()

  const { collections = [] } = await sdk.store.collection.list({
    limit: 200,
    offset: 0,
    fields: 'id,title,handle',
  })
  const want = FEATURED_DEALS_COLLECTION_TITLE.trim().toLowerCase()
  const featuredCol = collections.find((col) => {
    const t = (col.title && String(col.title).trim().toLowerCase()) || ''
    const h = (col.handle && String(col.handle).toLowerCase()) || ''
    return t === want || h === 'featured-deals' || h === 'featured_deals'
  })
  if (!featuredCol?.id) return []

  const { products = [] } = await sdk.store.product.list({
    limit: 100,
    offset: 0,
    region_id: getStoreRegionId(),
    collection_id: featuredCol.id,
    fields: 'id,title,description,thumbnail,metadata,*variants,*images',
  })

  return products.map((p) => ({
    id: p.id,
    title: p.title ?? 'Deal',
    price: priceLabelFromStoreProduct(p),
    description: plainProductDescription(p.description),
    imageUrl: productImageUrl(p),
    badge: dealBadgeFromMetadata(p.metadata),
  }))
}

function findPizzaCategory(categories) {
  return categories.find((c) => {
    const h = (c.handle && String(c.handle).toLowerCase()) || ''
    const n = (c.name && String(c.name).toLowerCase()) || ''
    return h === ARTISAN_PIZZA_CATEGORY_HANDLE || n === ARTISAN_PIZZA_CATEGORY_HANDLE
  })
}

/**
 * Products in category `pizza` and collection `Artisan Pizza` (Store API: category_id + collection_id).
 * @returns {Promise<{ id: string, name: string, description: string, priceLabel: string, imageUrl: string }[]>}
 */
export async function fetchArtisanPizzas() {
  const sdk = getMedusaV2Sdk()

  const { product_categories: categories = [] } = await sdk.store.category.list({
    limit: 200,
    offset: 0,
    fields: 'id,name,handle',
  })
  const pizzaCat = findPizzaCategory(categories)
  if (!pizzaCat?.id) return []

  const { collections = [] } = await sdk.store.collection.list({
    limit: 200,
    offset: 0,
    fields: 'id,title,handle',
  })
  const artisanCol = collections.find((col) => {
    const t = (col.title && String(col.title).trim().toLowerCase()) || ''
    const h = (col.handle && String(col.handle).toLowerCase()) || ''
    return (
      t === ARTISAN_PIZZA_COLLECTION_TITLE.trim().toLowerCase() ||
      h === 'artisan-pizza' ||
      h === 'artisan_pizza'
    )
  })
  if (!artisanCol?.id) return []

  const { products = [] } = await sdk.store.product.list({
    limit: 100,
    offset: 0,
    region_id: getStoreRegionId(),
    category_id: pizzaCat.id,
    collection_id: artisanCol.id,
    fields: 'id,title,description,thumbnail,*variants,*images',
  })

  return products.map((p) => ({
    id: p.id,
    name: p.title ?? 'Product',
    description: typeof p.description === 'string' && p.description.trim() ? p.description.trim() : '—',
    priceLabel: priceLabelFromStoreProduct(p),
    imageUrl: productImageUrl(p),
  }))
}

/**
 * Products in category `pizza` and collection with handle `byo`.
 * @returns {Promise<{ id: string, name: string, description: string, priceLabel: string, imageUrl: string }[]>}
 */
export async function fetchBuildYourOwnPizzas() {
  const sdk = getMedusaV2Sdk()

  const { product_categories: categories = [] } = await sdk.store.category.list({
    limit: 200,
    offset: 0,
    fields: 'id,name,handle',
  })
  const pizzaCat = findPizzaCategory(categories)
  if (!pizzaCat?.id) return []

  const { collections = [] } = await sdk.store.collection.list({
    limit: 200,
    offset: 0,
    fields: 'id,title,handle',
  })
  const byoCol = collections.find(
    (col) => (col.handle && String(col.handle).toLowerCase()) === BUILD_YOUR_OWN_COLLECTION_HANDLE
  )
  if (!byoCol?.id) return []

  const { products = [] } = await sdk.store.product.list({
    limit: 100,
    offset: 0,
    region_id: getStoreRegionId(),
    category_id: pizzaCat.id,
    collection_id: byoCol.id,
    fields: 'id,title,description,thumbnail,*variants,*images',
  })

  return products.map((p) => ({
    id: p.id,
    name: p.title ?? 'Product',
    description: typeof p.description === 'string' && p.description.trim() ? p.description.trim() : '—',
    priceLabel: priceLabelFromStoreProduct(p),
    imageUrl: productImageUrl(p),
  }))
}

/** Shorter catalog-style lists for non-pizza categories */
export const categoryItems = {
  appetizers: {
    intro: 'Start your meal with hot appetizers made to share — or keep for yourself.',
    items: [
      { name: 'Garlic knots', description: 'Baked fresh with garlic butter and parmesan.' },
      { name: 'Mozzarella sticks', description: 'Served with marinara.' },
      { name: 'Boneless wings', description: 'Tossed in your choice of sauce.' },
      { name: 'Bruschetta', description: 'Toasted bread, tomatoes, basil, olive oil.' },
    ],
  },
  rolls: {
    intro: 'Stuffed rolls baked until golden.',
    items: [
      { name: 'Pepperoni roll', description: 'Pepperoni and mozzarella in our house dough.' },
      { name: 'Spinach roll', description: 'Spinach, ricotta, and mozzarella.' },
      { name: 'Sausage roll', description: 'Italian sausage and peppers.' },
    ],
  },
  salad: {
    intro: 'Crisp greens and house-made dressings.',
    items: [
      { name: 'Garden salad', description: 'Mixed greens, vegetables, choice of dressing.' },
      { name: 'Caesar salad', description: 'Romaine, parmesan, croutons, Caesar dressing.' },
      { name: 'Greek salad', description: 'Feta, olives, peppers, red onion, vinaigrette.' },
    ],
  },
  subs: {
    intro: 'Oven-toasted subs on fresh bread.',
    items: [
      { name: 'Italian sub', description: 'Cured meats, cheese, lettuce, tomato, oil & vinegar.' },
      { name: 'Chicken parmesan sub', description: 'Breaded chicken, marinara, mozzarella.' },
      { name: 'Meatball sub', description: 'House meatballs, marinara, provolone.' },
    ],
  },
  pasta: {
    intro: 'Classic pasta baked or tossed to order.',
    items: [
      { name: 'Spaghetti & meatballs', description: 'Marinara and beef meatballs.' },
      { name: 'Fettuccine Alfredo', description: 'Creamy Alfredo with optional grilled chicken.' },
      { name: 'Baked ziti', description: 'Ricotta, mozzarella, marinara.' },
    ],
  },
  stromboli: {
    intro: 'Folded pizza dough stuffed with premium fillings.',
    items: [
      { name: 'Italian stromboli', description: 'Ham, salami, pepperoni, cheese.' },
      { name: 'Veggie stromboli', description: 'Peppers, mushrooms, onions, cheese.' },
    ],
  },
  desserts: {
    intro: 'Sweet finish to your meal.',
    items: [
      { name: 'Cinnamon breadsticks', description: 'With icing dip.' },
      { name: 'Chocolate chip cookie', description: 'Baked in-house.' },
    ],
  },
  drinks: {
    intro: 'Fountain drinks, bottled water, and more.',
    items: [
      { name: 'Soft drinks', description: 'Coke products — ask for sizes.' },
      { name: 'Bottled water', description: 'Still or sparkling.' },
    ],
  },
  catering: {
    intro: 'Feed a crowd — trays, sheet pizzas, and bundles for offices and parties.',
    items: [
      { name: 'Party pizza packs', description: 'Multiple large pizzas — mix and match toppings.' },
      { name: 'Pasta trays', description: 'Half or full trays with bread and salad add-ons.' },
      { name: 'Subs by the foot', description: 'Cut and plated for groups.' },
    ],
  },
}

export function getCategorySlugs(categories) {
  return categories.map((c) => c.slug)
}

export function isValidMenuSlug(slug, categories) {
  return getCategorySlugs(categories).includes(slug)
}
