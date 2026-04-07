# Functional tests (Medusa Store API)

These tests call a **running Medusa backend** using credentials from the storefront **`.env`** file at the project root (same variables as `npm run dev`).

## Prerequisites

1. **Medusa** is running and reachable at the URL in `VITE_MEDUSA_SERVER_URL` (or `http://localhost:9000` if unset).
2. **Publishable API key** is set so Store routes accept `x-publishable-api-key`.

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `VITE_API_MEDUSA_PUBLISHABLE_KEY` | **Yes** (for tests to run) | If missing, SDK-based suites are **skipped**. |
| `VITE_MEDUSA_SERVER_URL` | No | Medusa base URL (no trailing slash). Defaults to `http://localhost:9000`. |
| `VITE_MEDUSA_REGION_ID` | No | Region for priced product listings. Defaults to a dev fallback if unset. |
| `VITE_MEDUSA_SALES_CHANNEL_ID` | No | Passed to `GET /store/store-locations` when set. |

Copy from your working storefront `.env`; do not commit secrets.

## Commands

```bash
# From project root (react-medusa-storefront)
npm test
```

One-off run (CI-style):

```bash
npm test
```

Watch mode while developing tests:

```bash
npm run test:watch
```

## What is covered

- **`medusa-store-api.functional.test.js`** — `@medusajs/js-sdk` Store client: regions, product categories, collections, products (with `region_id`), and `fetch` to `GET /store/store-locations`.
- **`menu-data.functional.test.js`** — Same backend via app modules: `menuContent.js` fetchers and `fetchStoreLocations` from `storeLocations.js`.

`vitest.config.js` loads `.env` and defines `import.meta.env` for Node so `src/` imports behave like the Vite app.

## Troubleshooting

- **All SDK tests skipped** — Set `VITE_API_MEDUSA_PUBLISHABLE_KEY` in `.env`.
- **Connection / fetch errors** — Start Medusa; confirm `VITE_MEDUSA_SERVER_URL` matches where the API listens (including port).
- **`Local JWT storage is only available in the browser`** — Should not occur with current `medusaV2Sdk.js` (memory storage in Node). If you see this, ensure you are on the latest `src/utils/medusaV2Sdk.js`.
