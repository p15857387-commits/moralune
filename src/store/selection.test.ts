import { beforeEach, describe, expect, it } from "vitest";
import { MAX_QUANTITY, useSelectionStore } from "./selection";

describe("selection store", () => {
  beforeEach(() => useSelectionStore.setState({ items: [] }));

  it("adds, increments, updates and removes items", () => {
    const store = useSelectionStore.getState();
    store.add("p1"); store.add("p1"); store.add("p2");
    expect(useSelectionStore.getState().items).toEqual([{ productId: "p1", quantity: 2 }, { productId: "p2", quantity: 1 }]);
    useSelectionStore.getState().setQuantity("p1", 3);
    expect(useSelectionStore.getState().items[0].quantity).toBe(3);
    useSelectionStore.getState().remove("p2");
    expect(useSelectionStore.getState().items).toHaveLength(1);
  });

  it("clamps item quantities", () => {
    useSelectionStore.getState().add("p1", 99);
    expect(useSelectionStore.getState().items[0].quantity).toBe(MAX_QUANTITY);
    useSelectionStore.getState().setQuantity("p1", 0);
    expect(useSelectionStore.getState().items).toHaveLength(0);
  });
});
