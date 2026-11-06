# Product photos v1

Supplier placeholder photos for the internal assortment preview. The license is unconfirmed. The root metadata sets `robots: { index: false, follow: false }`, and `public/robots.txt` disallows every crawler. There is no `app/robots.ts`: Next.js rejects that file when `public/robots.txt` is also present. Do not treat these files as cleared for a public launch.

## Where files live

`public/products/v1/<SKU>/<filename>`

Example: `public/products/v1/RUG-TERRA-01-SND-160x230/detail-01.webp` is served at `/products/v1/RUG-TERRA-01-SND-160x230/detail-01.webp`.

`Product.image` is the hero. `Product.images` is the gallery, hero first. Cards and strips keep using `image`.

The chooser is `chooseProductPhotos()` in `src/data/product-photos-v1.ts`.

- `src/data/product-photos-v1.files.json` lists `sku`, `filename`, and `watermark` (`no`, `yes`, `suspected`). Regenerate it from the manifest with `node scripts/build-product-photos-v1.mjs`.
- `src/data/product-photos-v1-hero-plan.json` is the suggested hero and gallery order.
- `src/data/product-photos-v1.manifest.csv` is the source manifest, including watermark notes. It is not served from `public/`.

A `watermark=no` frame is preferred as the hero. `watermark=yes` is not the hero when any other frame exists, and those files are left out of the gallery. `suspected` is used when nothing clean is available. `THR-WAFL-01-SND-130x170` has only a watermarked frame, so that single file is the hero.

## Replace a photo in place

1. Export the new file under the same filename (`.jpg`, `.webp`, or `.png`).
2. Overwrite `public/products/v1/<SKU>/<filename>`.
3. Leave the SKU id and the slug alone. No product-master rewrite is required.

To change which file is the hero, edit the hero plan or set `watermark` to `no` on the frame that should lead. The catalog reads those JSON files when the server starts. `productPhotoRoot` in `src/data/product-photos-v1.ts` is the URL prefix.

## Move to a new folder

For a later HD set, add `public/products/v2/<SKU>/` with the same filenames and point `productPhotoRoot` at `/products/v2`. SKU ids stay the same. The v1 files can remain until the v2 folder is complete.

## Do not use

`RUG-TERRA-01-SND-160x230/main-01.jpg` is the wrong product (a kids tree rug with a YARIS watermark). The other five files in that folder are different YARIS designs, including more kids rugs, not a sand wool rug. `excludedPhotoFiles` omits the whole set from the hero and the gallery. The shop shows “No matching photo” for that SKU. The files stay in the folder so the exclusion can be checked. Do not point `image` at them. The hero plan’s `detail-01.webp` is one of those mismatched frames and is not followed. A corrected photo for this SKU needs a new filename, a row in `product-photos-v1.files.json`, and that filename kept out of `excludedPhotoFiles`. Overwriting `detail-01.webp` will not put it back on the page.
