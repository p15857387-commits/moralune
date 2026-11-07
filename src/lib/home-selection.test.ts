import { describe, expect, it } from "vitest";
import { listPreviewFallbackProducts } from "@/lib/catalog-source";
import { imageLedHomeEdit, homeCategoryLimit } from "./home-selection";
import type { Product } from "@/types";

const products = listPreviewFallbackProducts();

describe("homepage category edit", () => {
  it("shows six image-led pieces in each category and leaves the rest unpadded", () => {
    expect(imageLedHomeEdit(products, "art-rugs")).toMatchObject({
      eligible: 9,
      shown: 6,
      shortfall: 0,
      items: [
        { id: "RUG-TERRA-02-RST-160x230" },
        { id: "RUG-TERRA-03-OAT-160x230" },
        { id: "RUG-TERRA-04-CLY-160x230" },
        { id: "RUG-TERRA-05-IVR-160x230" },
        { id: "RUG-TERRA-06-OLV-160x230" },
        { id: "RUG-SAHL-01-NAT-160x230" },
      ],
    });
    expect(imageLedHomeEdit(products, "cushions-throws").items.map((item) => item.id)).toEqual([
      "CSH-VELA-01-RST-45x45",
      "CSH-VELA-02-OLV-45x45",
      "CSH-BOUC-01-IVR-45x45",
      "CSH-BOUC-02-OAT-30x50",
      "CSH-WEAV-01-SND-45x45",
      "CSH-LINO-01-NAT-45x45",
    ]);
    expect(imageLedHomeEdit(products, "wall-art")).toMatchObject({ eligible: 7, shown: 6, shortfall: 0 });
    expect(imageLedHomeEdit(products, "wall-art").items.map((item) => item.id)).toEqual([
      "WAL-RELF-01-IVR-90x120",
      "WAL-RELF-02-MUL-90x120",
      "WAL-RELF-03-TER-90x120",
      "WAL-RELF-04-SND-90x120",
      "WAL-RELF-05-MUL-90x120",
      "WAL-RELF-06-OLV-90x120",
    ]);
    expect(imageLedHomeEdit(products, "artful-storage").items.map((item) => item.id)).toEqual([
      "OBJ-KILN-01-CLY-H30",
      "OBJ-KILN-02-BEI-M",
      "OBJ-KILN-03-RST-H15",
      "OBJ-KILN-04-WHT-17x28",
      "OBJ-KILN-05-WHT-H20",
      "OBJ-KILN-06-GRN-D15xH20",
    ]);
    expect(imageLedHomeEdit(products, "decorative-lighting").items.map((item) => item.id)).toEqual([
      "LGT-ORLA-01-BLK-D41xH70-US",
      "LGT-ORLA-02-WHT-STD-UK",
      "LGT-ORLA-03-WHT-OVL-UK",
      "LGT-PLIS-01-RED-STD-US",
      "LGT-PLIS-02-IVR-STD-US",
      "LGT-TRAV-01-BEI-D20xH50-UK",
    ]);
  });

  it("keeps mismatched rug frames and hidden wall pieces out of the edit", () => {
    const shown = ["art-rugs", "cushions-throws", "wall-art", "artful-storage", "decorative-lighting"]
      .flatMap((slug) => imageLedHomeEdit(products, slug).items.map((item) => item.id));
    expect(shown).not.toContain("RUG-TERRA-01-SND-160x230");
    expect(shown.some((id) => id.startsWith("WAL-LOOM"))).toBe(false);
    expect(new Set(shown).size).toBe(shown.length);
    for (const item of ["art-rugs", "wall-art"].flatMap((slug) => imageLedHomeEdit(products, slug).items)) {
      expect(item.image).toBeTruthy();
      expect(item.image).not.toContain("RUG-TERRA-01");
    }
  });

  it("does not pad a short category and still refuses a mismatched photo path", () => {
    const name = { "zh-CN": "", en: "Piece" };
    const base = { name, price: 0, available: false, category: "art-rugs", status: "draft" as const, published: false };
    const terra = { ...base, id: "RUG-TERRA-01-SND-160x230", slug: "terra", image: "/products/v1/RUG-TERRA-01-SND-160x230/detail-01.webp" };
    const loom = { ...base, id: "WAL-LOOM-01-NAT-68x40", slug: "loom", category: "wall-art", image: "/products/v1/WAL-LOOM-01-NAT-68x40/main-01.jpg", offAssortment: true, listingRecommendation: "do-not-list" as const };
    const one = { ...base, id: "RUG-SAHL-01-NAT-160x230", slug: "sahl", image: "/products/v1/RUG-SAHL-01-NAT-160x230/main-01.jpg" };
    const edit = imageLedHomeEdit([terra, one, one, loom] as Product[], "art-rugs");
    expect(edit.items.map((item) => item.id)).toEqual(["RUG-SAHL-01-NAT-160x230"]);
    expect(edit.eligible).toBe(1);
    expect(edit.shown).toBe(1);
    expect(edit.shortfall).toBe(homeCategoryLimit - 1);
    expect(imageLedHomeEdit([loom] as Product[], "wall-art").items).toEqual([]);
  });
});
