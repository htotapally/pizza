import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import { defineConfig } from 'vitest/config'

const root = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(root, '.env') })

const e = process.env

/**
 * Mirrors Vite `define` so `import.meta.env` works when tests import `src/` modules
 * (same keys as `menuContent.js`, `medusaV2Sdk.js`, `medusaBaseUrl.js`, `storeLocations.js`).
 */
export default defineConfig({
  define: {
    'import.meta.env.VITE_API_MEDUSA_PUBLISHABLE_KEY': JSON.stringify(
      e.VITE_API_MEDUSA_PUBLISHABLE_KEY ?? ''
    ),
    'import.meta.env.VITE_MEDUSA_SERVER_URL': JSON.stringify(e.VITE_MEDUSA_SERVER_URL ?? ''),
    'import.meta.env.VITE_MEDUSA_REGION_ID': JSON.stringify(e.VITE_MEDUSA_REGION_ID ?? ''),
    'import.meta.env.VITE_MEDUSA_SALES_CHANNEL_ID': JSON.stringify(
      e.VITE_MEDUSA_SALES_CHANNEL_ID ?? ''
    ),
    'import.meta.env.DEV': JSON.stringify(false),
    'import.meta.env.MODE': JSON.stringify('test'),
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.functional.test.js'],
    testTimeout: 30000,
    hookTimeout: 30000,
  },
})
