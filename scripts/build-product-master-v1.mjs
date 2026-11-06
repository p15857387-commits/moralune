import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const csvPath = resolve(root, "src/data/product-master-v1.csv");
const jsonPath = resolve(root, "src/data/product-master-v1.json");

const columns = [
  ["category", "categoryCode"],
  ["proposed_sku", "sku"],
  ["supplier", "supplier"],
  ["supplier_type_on_page", "supplierType"],
  ["source_url", "sourceUrl"],
  ["product_name_source", "productNameSource"],
  ["material_composition", "materialComposition"],
  ["craft", "craft"],
  ["dimensions_size_variants", "dimensionsSizeVariants"],
  ["colors", "colors"],
  ["weight", "weight"],
  ["packaging", "packaging"],
  ["moq", "moq"],
  ["listed_price", "listedPrice"],
  ["price_captured", "priceCaptured"],
  ["sample_time", "sampleTime"],
  ["bulk_lead_time", "bulkLeadTime"],
  ["certifications_stated", "certificationsStated"],
  ["care_stated_by_source", "careStatedBySource"],
  ["title_en_draft", "titleEnDraft"],
  ["short_description_en_draft", "shortDescriptionEnDraft"],
  ["care_label_en_draft", "careLabelEnDraft"],
  ["compliance_notes", "complianceNotes"],
  ["fob_unit_est_usd", "fobUnitEstUsd"],
  ["suggested_retail_usd_est", "suggestedRetailUsdEst"],
  ["implied_gross_margin_est", "impliedGrossMarginEst"],
  ["brand_fit_flag", "brandFitFlag"],
  ["url_check_2026-11-06", "urlCheck"],
];

export function parseCsv(text) {
  const source = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];
    if (inQuotes) {
      if (char === '"') {
        if (source[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      field = "";
      rows.push(row);
      row = [];
    } else if (char !== "\r") {
      field += char;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((cells) => cells.some((cell) => cell.trim() !== ""));
}

function isUnknownPrice(value) {
  const text = value.trim().toLowerCase();
  return text === "unknown" || text.startsWith("unknown ") || text.startsWith("unknown(") || text.includes("not usable") || text.includes("placeholder");
}

const table = parseCsv(readFileSync(csvPath, "utf8"));
const header = table[0];
const expected = columns.map(([csv]) => csv);
if (header.join("|") !== expected.join("|")) {
  throw new Error(`Unexpected CSV header:\n${header.join(",")}`);
}

const records = table.slice(1).map((cells, index) => {
  if (cells.length !== columns.length) {
    throw new Error(`Row ${index + 2} has ${cells.length} columns, expected ${columns.length}`);
  }
  const record = {};
  columns.forEach(([, key], cellIndex) => {
    record[key] = cells[cellIndex];
  });
  return record;
});

const skus = new Set(records.map((record) => record.sku));
if (skus.size !== records.length) throw new Error("Duplicate SKUs in product master");

writeFileSync(jsonPath, `${JSON.stringify(records, null, 2)}\n`);

const unknownFob = records.filter((record) => isUnknownPrice(record.fobUnitEstUsd));
const unknownRetail = records.filter((record) => isUnknownPrice(record.suggestedRetailUsdEst));
const unknownMargin = records.filter((record) => isUnknownPrice(record.impliedGrossMarginEst));
const unknownListed = records.filter((record) => isUnknownPrice(record.listedPrice));
const byCategory = records.reduce((counts, record) => {
  counts[record.categoryCode] = (counts[record.categoryCode] ?? 0) + 1;
  return counts;
}, {});

console.log(JSON.stringify({
  imported: records.length,
  byCategory,
  unknownFob: unknownFob.map((record) => record.sku),
  unknownRetail: unknownRetail.map((record) => record.sku),
  unknownMargin: unknownMargin.map((record) => record.sku),
  unknownListed: unknownListed.map((record) => record.sku),
}, null, 2));
