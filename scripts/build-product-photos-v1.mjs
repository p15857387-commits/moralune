import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseCsv } from "./build-product-master-v1.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = resolve(root, "src/data/product-photos-v1.manifest.csv");
const jsonPath = resolve(root, "src/data/product-photos-v1.files.json");
const masterPath = resolve(root, "src/data/product-master-v1.json");
const photoRoot = resolve(root, "public/products/v1");

const table = parseCsv(readFileSync(manifestPath, "utf8"));
const header = table[0];
const expected = ["sku", "filename", "source_page_url", "image_url", "width", "height", "watermark", "license_status", "notes"];
if (header.join("|") !== expected.join("|")) {
  throw new Error(`Unexpected photo manifest header:\n${header.join(",")}`);
}

const watermark = new Set(["no", "yes", "suspected"]);
const files = table.slice(1).map((cells, index) => {
  if (cells.length !== expected.length) {
    throw new Error(`Photo manifest row ${index + 2} has ${cells.length} columns, expected ${expected.length}`);
  }
  const [sku, filename, , , , , flag] = cells;
  if (!sku || !filename) throw new Error(`Photo manifest row ${index + 2} is missing sku or filename`);
  if (!watermark.has(flag)) throw new Error(`Photo manifest row ${index + 2} has watermark ${flag}`);
  const absolute = resolve(photoRoot, sku, filename);
  if (!existsSync(absolute)) throw new Error(`Missing photo file public/products/v1/${sku}/${filename}`);
  return { sku, filename, watermark: flag };
});

const master = JSON.parse(readFileSync(masterPath, "utf8"));
const masterSkus = new Set(master.map((record) => record.sku));
const fileSkus = new Set(files.map((file) => file.sku));
for (const sku of masterSkus) {
  if (!fileSkus.has(sku)) throw new Error(`Product master SKU ${sku} has no photos`);
}
for (const sku of fileSkus) {
  if (!masterSkus.has(sku)) throw new Error(`Photo SKU ${sku} is not in the product master`);
}

writeFileSync(jsonPath, `${JSON.stringify(files, null, 2)}\n`);
console.log(JSON.stringify({ files: files.length, skus: fileSkus.size }, null, 2));
