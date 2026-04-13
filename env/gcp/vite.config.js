import path from "path"
import { fileURLToPath } from "url"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const medusaTarget = process.env.VITE_MEDUSA_PROXY_TARGET || "http://localhost:9000"

const medusaProxy = {
  // Store API (carts, products, …)
  "/store": {
    target: medusaTarget,
    changeOrigin: true,
  },
  // Auth API (register, login, logout) — required for customer account; not under /store
  "/auth": {
    target: medusaTarget,
    changeOrigin: true,
  },
  "/uploads": {
    target: medusaTarget,
    changeOrigin: true,
  },
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    'process.env.VITE_API_MEDUSA_PUBLISHABLE_KEY': JSON.stringify(process.env.VITE_API_MEDUSA_PUBLISHABLE_KEY)
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 8000,
    // Dev: avoid CORS by calling Medusa via same origin (browser → Vite → Medusa).
    // Use VITE_MEDUSA_SERVER_URL=http://localhost:8000 in .env during local dev.
    // For deployed sites, set VITE_MEDUSA_SERVER_URL to your API and STORE_CORS on Medusa.
    proxy: medusaProxy,
    allowedHosts: ['storov.com']
  },
  preview: {
    port: 8000,
    proxy: medusaProxy,
  },
})