import Medusa from "@medusajs/medusa-js"
import { getMedusaBaseUrl } from "./medusaBaseUrl.js"

const apiKey = process.env.VITE_API_MEDUSA_PUBLISHABLE_KEY

const medusaClient = new Medusa({ baseUrl: getMedusaBaseUrl(), publishableApiKey: apiKey })

export { medusaClient }
