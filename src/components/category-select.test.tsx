import type { ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CategorySelect, type CategoryChoice } from "./category-select";

vi.mock("next/image", () => ({
  default: (props: { alt?: string }) => <img alt={props.alt ?? ""} />,
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

const choices: CategoryChoice[] = [
  { id: "RUG-A", slug: "rug-a", name: "First rug", detail: "Wool, sand.", image: "/a.jpg", saleLabel: "Not for sale" },
  { id: "RUG-B", slug: "rug-b", name: "Second rug", detail: "Wool, oat.", image: "/b.jpg", saleLabel: "Not for sale" },
  { id: "RUG-C", slug: "rug-c", name: "Third rug", detail: "Wool, clay.", image: "/c.jpg", saleLabel: "Not for sale" },
];

function renderEdit() {
  return render(
    <CategorySelect
      locale="en"
      slug="art-rugs"
      indexLabel="01"
      title="Rugs"
      blurb="Wool underfoot."
      choices={choices}
      listLabel="Rugs in this edit"
      viewLabel="View this piece"
      allLabel="All rugs"
    />,
  );
}

describe("category select", () => {
  it("changes the featured piece on click and with the keyboard, not on hover", () => {
    renderEdit();
    expect(screen.getByRole("heading", { level: 3, name: "First rug" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "First rug" })).toHaveAttribute("aria-selected", "true");

    fireEvent.mouseEnter(screen.getByRole("option", { name: "Second rug" }));
    expect(screen.getByRole("heading", { level: 3, name: "First rug" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("option", { name: "Second rug" }));
    expect(screen.getByRole("heading", { level: 3, name: "Second rug" })).toBeInTheDocument();
    expect(screen.getByText("Wool, oat.")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Second rug" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("option", { name: "First rug" })).toHaveAttribute("aria-selected", "false");

    fireEvent.keyDown(screen.getByRole("option", { name: "Second rug" }), { key: "ArrowDown" });
    expect(screen.getByRole("heading", { level: 3, name: "Third rug" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Third rug" })).toHaveFocus();

    fireEvent.keyDown(screen.getByRole("option", { name: "Third rug" }), { key: "Home" });
    expect(screen.getByRole("heading", { level: 3, name: "First rug" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "First rug" })).toHaveFocus();
  });
});
