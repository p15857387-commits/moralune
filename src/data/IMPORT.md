# Product master v1 import

Source: `src/data/product-master-v1.csv` (UTF-8, 50 data rows, 28 columns), generated 2026-11-06. Runtime copy: `src/data/product-master-v1.json`, loaded by `src/data/product-master-v1.ts`. Regenerate the JSON with `node scripts/build-product-master-v1.mjs`.

**Imported: 50. Skipped: 0.** Existing demo products in `src/data/catalog.ts` are unchanged and stay published.

Every imported SKU is `status: "draft"`, `published: false`, `available: false`, `featured: false`, and `price: 0`. `price: 0` means no confirmed sell price. It is not a free price. Checkout rejects a non-positive price, and there are no PayPal USD price-map entries for these SKUs. Do not copy `suggested_retail_usd_est` into `Product.price` or `PAYPAL_USD_PRICES`.

Drafts stay `published: false`, so checkout, inquiry pricing, and the sitemap still use `isPublicCatalogProduct()` and skip them. For this noindex preview, `isPreviewListedProduct()` shows the other 47 drafts on the shop and product page. They stay `price: 0` and `available: false`. WAL-LOOM-01/02/03 stay off the list. Supplier cost fields never sit on the storefront `Product`. Photos: `src/data/PHOTOS.md`.

## Category map

| CSV `category` | Count | Storefront slug | Notes |
| --- | --- | --- | --- |
| RUG | 10 | `art-rugs` | |
| CSH | 6 | `cushions-throws` | One SKU per row. Other sizes stay in `sizeVariants`. |
| THR | 4 | `cushions-throws` | Same category as cushions. |
| WAL | 10 | `wall-art` | Includes 3 WAL-LOOM rows flagged do-not-list. |
| OBJ | 10 | `artful-storage` | Existing objects / small-decor category. Display name is already Objects / 器物. No second category was added. |
| LGT | 10 | `decorative-lighting` | |

## Field mapping

| CSV column | Internal `ProductMasterRecord` | Storefront `Product` |
| --- | --- | --- |
| `category` | `categoryCode` | `category` via the slug map above |
| `proposed_sku` | `sku` | `id` (SKU unchanged) and `slug` (SKU lowercased) |
| `title_en_draft` | `titleEnDraft` | `name.en`. `name["zh-CN"]` is `""` |
| `short_description_en_draft` | `shortDescriptionEnDraft` | `description.en`. zh-CN is `""` |
| `care_label_en_draft` | `careLabelEnDraft` | `care.en`. zh-CN is `""` |
| `material_composition` | `materialComposition` | `material.en` (verbatim, including `unknown`) |
| `dimensions_size_variants` | `dimensionsSizeVariants` | `dimensions.en` and `sizeVariants.en` (one field, not extra SKUs) |
| `colors` | `colors` | `colors.en` (not exploded) |
| `craft` | `craft` | `craft.en` |
| `supplier` | `supplier` | not copied |
| `supplier_type_on_page` | `supplierType` | not copied |
| `source_url` | `sourceUrl` | not copied |
| `product_name_source` | `productNameSource` | not copied |
| `weight`, `packaging`, `moq` | same names | not copied |
| `listed_price`, `price_captured` | `listedPrice`, `priceCaptured` | not copied |
| `sample_time`, `bulk_lead_time` | `sampleTime`, `bulkLeadTime` | not copied |
| `certifications_stated` | `certificationsStated` | not copied |
| `care_stated_by_source` | `careStatedBySource` | not copied (our draft care label is `care_label_en_draft`) |
| `compliance_notes` | `complianceNotes` | not copied |
| `fob_unit_est_usd` | `fobUnitEstUsd` | not copied. Not `Product.price` |
| `suggested_retail_usd_est` | `suggestedRetailUsdEst` | not copied. Not `Product.price` |
| `implied_gross_margin_est` | `impliedGrossMarginEst` | not copied |
| `brand_fit_flag` | `brandFitFlag` | not copied |
| `url_check_2026-11-06` | `urlCheck` | not copied |
| — | `listingRecommendation`, `offAssortment`, `usReady` | recommendation and off-assortment only. `usReady` stays internal |
| — | — | `price` is `0`, `status` is `draft`, `published` is `false`, `available` is `false` |
| — | photo files | `image` is the hero. `images` is the gallery. See `PHOTOS.md` |

zh-CN strings are empty on purpose. TODO: translate before any future publish. The shop falls back to English when zh-CN is blank. English titles are copied. Short descriptions drop assertive fibre or certification claims when the material line is unknown, conflicting, or unverified. Material and size lines that are wholly `unknown` are omitted. Uncertain lines stay visible with `unverifiedFields` so the page can label them “Not confirmed”. `certifications_stated` is not copied and is not shown as a badge.

## Counts and issues

- **Unknown FOB, listed price, and margin: 11 SKUs.** Left as the CSV text (`unknown`, or the unusable placeholder). No number was invented.
  - CSH-VELA-01, CSH-VELA-02, CSH-BOUC-01, CSH-BOUC-02, CSH-WEAV-01, CSH-LINO-01
  - THR-LINO-03
  - OBJ-KILN-06
  - LGT-PLIS-01 (listed price is `US$1.00-500.00`, marked not usable; FOB `unknown`)
  - LGT-ORLA-04, LGT-PLIS-03
- **Suggested retail is an EST range on all 50 rows**, including the 11 above (for example `EST 38-58`). None of those ranges were turned into a checkout price.
- **WAL-LOOM-01, WAL-LOOM-02, WAL-LOOM-03** are imported, not skipped. `listingRecommendation` is `do-not-list` and `offAssortment` is `true`. Brand-fit text marks all three off-brief. LOOM-02 and LOOM-03 also say not recommended. LOOM-01 says keep only as an entry price test.
- **Lamps.** Only `LGT-ORLA-01-BLK-D41xH70-US` has internal `usReady: true` (E26 / 110-120V / ETL stated). It is still draft, unpublished, and `available: false`. The other nine lamps stay `usReady: false`. Voltage and cert notes remain on `certificationsStated`, `complianceNotes`, and `brandFitFlag` (E27, UK plug, battery LED, 90-260V, missing certs). Those notes are not on the public product.
- **Supplier placeholder photos** are attached for 49 SKUs, including the three off-assortment wall pieces. Every frame filed under `RUG-TERRA-01-SND-160x230` is a mismatched YARIS design, so that SKU is listed with no photo. See `src/data/PHOTOS.md`.
- **PayPal checkout was not enabled**, and no USD sell prices were added for these SKUs. The preview shows “Not for sale” instead of a zero price.
