# Codex handoff

Preview storefront on branch `cursor/international-homepage-af83` (pull request 7). This file is the website-source handoff. It does not contain prices, supplier research, or secrets.

Nothing in this branch is for sale. `robots` is `noindex, nofollow`, and `public/robots.txt` disallows every crawler. Checkout and payment stay off. Do not deploy this branch to production from this handoff.

## Commands

Verified with Node.js v22.23.4 and npm 10.9.9. The package manifest does not pin `engines`.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Dev server: http://localhost:3000. English is `/en`. Chinese is `/zh-CN`.

```bash
npm test
npm run lint
npm run build
npm run start
```

`npm test` runs Vitest. `npm run test:e2e` runs Playwright and is not required for the catalog handoff. `npm run build` is the production build check. It does not deploy.

## Branch and production

- This branch head is the photo-assortment preview. `main` at the time of this handoff is `782820333d38be4f9ad5294f5b9b802681faa0e5`, the earlier supplier-photo preview.
- The shop lists 48 draft products from `public/products/v2`, not the old supplier SKUs.
- Counts: rugs 9, cushions 9, wall-hangings 9, objects 12, lamps 9.
- Each product has `price: 0`, `status: "draft"`, `published: false`, and `available: false`.
- USD test prices are not filled. `src/data/usd-test-prices.ts` is an empty slug-to-cents map. Wait for the 48-row research CSV before adding any amount.
- PayPal checkout defaults off (`PAYPAL_CHECKOUT_ENABLED=false`). A test price must not be copied into `PAYPAL_USD_PRICES`.

## Catalog and images

| What | Path |
| --- | --- |
| Camera-id rows | `src/data/photo-assortment-v2.files.json` |
| Five named leads and shop order | `src/data/photo-assortment-v2.ts` |
| Shop product list | `src/data/catalog.ts` (`products`) |
| Empty USD test-price map | `src/data/usd-test-prices.ts` |
| Formatter | `src/lib/usd-test-price.ts` |
| Photos | `public/products/v2/{category}/{filename}` |

Shop order puts one named lead first in each category and then keeps the camera-id order. Slugs, in that order:

- rugs: `rug-organic-01`, `img-3545`, `img-3546`, `img-3549`, `img-3550`, `img-3551`, `img-3552`, `img-3553`, `img-3556`
- cushions: `cushion-sphere-01`, `img-3537`, `img-3538`, `img-3539`, `img-3540`, `img-3541`, `img-3542`, `img-3543`, `img-3544`
- wall-hangings: `wall-clock-01`, `img-3560`, `img-3561`, `img-3562`, `img-3563`, `img-3564`, `img-3566`, `img-3567`, `img-3569`
- objects: `object-footed-bowl-01`, `img-3571`, `img-3573`, `img-3574`, `img-3575`, `img-3576`, `img-3577`, `img-3578`, `img-3579`, `img-3580`, `img-3583`, `img-3584`
- lamps: `lamp-stitched-01`, `img-3581`, `img-3582`, `img-3585`, `img-3586`, `img-3587`, `img-3588`, `img-3589`, `img-3590`

`IMG_3581` and `IMG_3582` are lamps only. There is no sixth category and `其他杂项` is not listed.

When a positive integer cent amount is later entered for an exact slug, the shop list and product page show `USD TEST PRICE $X.XX` in both locales and still say the piece is not for sale. No amount is shown until that map has a valid row. The legacy `price` field is not formatted as CNY.

Image files are served from `public/` at their stored pixel size. Product cards mark `/products/v2/` images `unoptimized`, so Next.js does not resize them.

## Logos, fonts, and the About photograph

Wordmarks and icons used by the storefront are local files in `public/`:

- `/moralune-wordmark-blue-transparent.png`
- `/moralune-wordmark-blue-on-moon-mist.png`
- `/moralune-wordmark-white-on-deep-night.png`
- `/moralune-mark-moon-blue-transparent.png`
- `/favicon.ico`, `/favicon-16.png`, `/favicon-32.png`, `/favicon-48.png`, `/favicon-180.png`, `/favicon-192.png`, `/favicon-512.png`, `/apple-touch-icon.png`

Matching source artwork also lives in `brand/assets/`. No storefront path uses a VM absolute path.

Type is self-hosted. `src/app/globals.css` imports `src/app/fonts.css`, which points at woff2 files in `public/fonts/`. Families and weights match the previous Google Fonts request: DM Sans 300/400/500/700, Newsreader 300/400, Noto Sans SC 300/400/500/700, Noto Serif SC 400/500. The Chinese families include every unicode-range file from those Fontsource packages for those weights, so Simplified Chinese coverage is not reduced to the characters already on the page. Licenses and package versions are in `public/fonts/NOTICE.md` and `public/fonts/licenses/`. Those licenses do not cover the product photographs.

The About hero is `/images/about/quiet-home-interior.jpg` (1800×1013), the same crop previously loaded from Unsplash photo `photo-1616486338812-3dadae4b4ace`. Credit and the Unsplash License are in `public/images/about/NOTICE.md`. It is not a shop product photo.

`next.config.ts` still allows `cdn.sanity.io` for an optional Sanity catalog. With Sanity unset, the pages do not request it. No Google Fonts or Unsplash URL remains in the storefront source.

## Environment variable names

Copy `.env.example` to `.env.local`. Values below are names only.

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_TOKEN`
- `RESEND_API_KEY`
- `INQUIRY_EMAIL`
- `FROM_EMAIL`
- `SHOPPAAS_STORE_URL` (read by the app; optional; leave unset)
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `PAYPAL_ENVIRONMENT` (`sandbox` or `live`)
- `PAYPAL_CHECKOUT_ENABLED` (`true` or `false`; keep `false`)
- `PAYPAL_USD_PRICES` (confirmed sell-price JSON; keep empty)

Optional and currently missing on a fresh checkout: Sanity project id and token, Resend key and inquiry addresses, PayPal client id and secret, Shoppaas URL. The preview runs without them.

## Later website ZIP

Include tracked source, `public/` pictures, fonts, licenses, and logos, `brand/`, `package.json`, `package-lock.json`, config, `README.md`, this file, and `.env.example`.

Exclude `node_modules`, `.next`, `.git`, real `.env` files, credentials, cookies, sessions, and private business research. Do not package a price CSV until it has been accepted into `src/data/usd-test-prices.ts`.

## Still waiting

The 48-row USD research CSV. Do not invent prices, do not package the final ZIP, and do not deploy before that file is applied.
