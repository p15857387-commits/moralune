"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type CategoryChoice = {
  id: string;
  slug: string;
  name: string;
  detail: string;
  image: string;
  saleLabel: string;
};

type Props = {
  locale: string;
  slug: string;
  indexLabel: string;
  title: string;
  blurb: string;
  choices: CategoryChoice[];
  listLabel: string;
  viewLabel: string;
  allLabel: string;
};

export function CategorySelect({ locale, slug, indexLabel, title, blurb, choices, listLabel, viewLabel, allLabel }: Props) {
  const [index, setIndex] = useState(0);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const selected = choices[index];
  if (!selected) return null;

  function focusAt(next: number) {
    const clamped = Math.max(0, Math.min(choices.length - 1, next));
    setIndex(clamped);
    buttons.current[clamped]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, current: number) {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      focusAt(current + 1);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      focusAt(current - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusAt(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusAt(choices.length - 1);
    }
  }

  return (
    <section className="category-edit" id={slug} aria-labelledby={`${slug}-title`}>
      <div className="category-edit-stage">
        <figure className="category-edit-figure">
          <Image key={selected.id} className="category-edit-photo" src={selected.image} alt={selected.name} fill sizes="(max-width: 860px) 100vw, 58vw" />
        </figure>
        <div className="category-edit-panel">
          <p className="eyebrow">{indexLabel}</p>
          <h2 id={`${slug}-title`}>{title}</h2>
          <p className="category-edit-blurb">{blurb}</p>
          <div className="category-edit-selected" aria-live="polite">
            <h3>{selected.name}</h3>
            {selected.detail ? <p>{selected.detail}</p> : null}
            <p className="category-edit-sale">{selected.saleLabel}</p>
            <Link className="text-link" href={`/${locale}/products/${selected.slug}`}>{viewLabel}<ArrowRight size={15} /></Link>
          </div>
          <div className="category-edit-choices" role="listbox" aria-label={listLabel}>
            {choices.map((choice, choiceIndex) => (
              <button
                key={choice.id}
                id={`${slug}-opt-${choice.id}`}
                ref={(node) => { buttons.current[choiceIndex] = node; }}
                type="button"
                role="option"
                aria-selected={choiceIndex === index}
                tabIndex={choiceIndex === index ? 0 : -1}
                data-sku={choice.id}
                onClick={() => setIndex(choiceIndex)}
                onKeyDown={(event) => onKeyDown(event, choiceIndex)}
              >
                <span className="category-edit-thumb">
                  <Image src={choice.image} alt="" fill sizes="88px" />
                </span>
                <span>{choice.name}</span>
              </button>
            ))}
          </div>
          <Link className="text-link" href={`/${locale}/shop?category=${slug}`}>{allLabel}<ArrowRight size={15} /></Link>
        </div>
      </div>
    </section>
  );
}
