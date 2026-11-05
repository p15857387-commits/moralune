# moralune

Moralune storefront scaffold. A bilingual Next.js + React/TypeScript shop for browsing objects, keeping a local Selection (Zustand), and sending an inquiry. Sanity is the optional catalog. Purchase handoff stays on the existing external SHOPPAAS pattern. This repo does not add payment, cart checkout, or order APIs.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open http://localhost:3000. With Sanity and Resend left empty, the site uses the built-in catalog and demo inquiry mode. Copy only `.env.example`; do not commit secrets.

```bash
npm test
npm run lint
npm run build
```

## Brand v0.2.1

Locked brand color is moralune Blue `#003AF4` (wordmark, selection count, and other small accents — keep it under about 8% of the page). Default background is Moon Mist `#F4F1EC`, with Soft Clay `#E8DFD4`, Ink `#2C2B29`, and Deep Night `#1A1C1F`. Lunar Gold `#C4A574` and Stone `#9A958C` are secondary accents. Tokens, guidelines, and source assets live in `brand/`.
