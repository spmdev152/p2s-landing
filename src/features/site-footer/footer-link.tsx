"use client";

import Link from "next/link";

import { scrollToSection } from "@/lib/scroll-to-section";

/**
 * Props accepted by {@link FooterLink}.
 */
export interface FooterLinkProps {
  /** Destination. A `#section` hash glides to that section. */
  readonly href: string;
  /** Visible label. */
  readonly label: string;
  /** Two digit marker rendered before the label. A square stands in without one. */
  readonly index?: string;
}

/**
 * A footer link: a volt marker, then the label. On hover and keyboard focus a
 * volt bar grows out of the marker, pushing the label along, and the label
 * turns volt.
 */
export function FooterLink({ href, label, index }: FooterLinkProps) {
  return (
    <Link
      href={href}
      onClick={scrollToSection}
      className="group ease-quick inline-flex items-center py-1.5 whitespace-nowrap text-chalk/80 transition-colors duration-200 hover:text-volt focus-visible:text-volt"
    >
      {index === undefined ? (
        <span aria-hidden className="mr-3 size-1.5 shrink-0 bg-volt" />
      ) : (
        <span className="mr-3 font-mono text-eyebrow text-volt">{index}</span>
      )}
      <span
        aria-hidden
        className="ease-snap h-0.5 w-0 shrink-0 bg-volt transition-[width,margin] duration-300 group-hover:mr-2 group-hover:w-4 group-focus-visible:mr-2 group-focus-visible:w-4"
      />
      {label}
    </Link>
  );
}
