import { MicroTag } from "@/components/ui/micro-tag";
import type { Capability } from "@/content/capabilities";
import type { FooterContent } from "@/content/footer-content";

import { FooterLink } from "./footer-link";

/**
 * Props accepted by {@link SiteFooter}.
 */
export interface SiteFooterProps {
  /** Copy, index and closing notices. */
  readonly content: FooterContent;
  /** Disciplines listed in their own column. */
  readonly capabilities: readonly Capability[];
}

/** Stroke of every rule inside the band. */
const RULE = "border-chalk/12";

/** Micro label heading a cell. */
const CELL_TITLE = "font-mono text-eyebrow text-ash uppercase";

/**
 * The site footer: a full-bleed band closing the page, the bottom counterpart
 * of the header.
 *
 * Its surface and its horizontal rules run from edge to edge of the viewport,
 * while the content keeps to the page's measure. Inside, one grid of cells
 * split by the system's 2px rules: the statement, the index and the
 * disciplines on top, and a closing row with the notices beneath them, whose
 * vertical rules carry on from the cells above so the notices read as the
 * grid's last row rather than something left outside it.
 *
 * Cells in a row share one height, so every piece is pinned to its cell's
 * edges: the eyebrow and both column titles share the top line, and the
 * closing sentence sits on the statement cell's bottom edge. The outer
 * cells have no padding on their outer side, so the content lines up with the
 * header's mark and its action.
 *
 * On wide screens the cells take five, three and four columns. Below that the
 * statement spans the band and the two lists split the row beneath it, and on
 * phones every cell stacks. The closing row only splits into cells from `xl`,
 * where the index column is wide enough to hold its notice on one line. Below
 * that the copyright and the rights notice travel together, opposite the
 * signature from `lg` and stacked above it below that.
 *
 * A server component: only its links reach the client. The page is
 * prerendered, so the copyright year is the year of the build.
 */
export function SiteFooter({ content, capabilities }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate border-t-2 border-volt/25 bg-carbon/50">
      <div className="shell grid sm:grid-cols-2 lg:grid-cols-12">
        <div
          className={`flex flex-col items-start gap-10 border-b-2 ${RULE} py-10 sm:col-span-2 lg:col-span-5 lg:border-r-2 lg:border-b-0 lg:py-14 lg:pr-10`}
        >
          <div className="flex flex-col items-start gap-8">
            <MicroTag className="border-volt/40 text-volt">{content.eyebrow}</MicroTag>

            <p className="font-display text-display text-chalk uppercase">
              <span className="block">{content.statementLines[0]}</span>
              <span className="block text-volt">{content.statementLines[1]}</span>
            </p>
          </div>

          <p className="mt-auto max-w-sm text-lede text-ash">{content.tagline}</p>
        </div>

        <nav
          aria-labelledby="footer-index-title"
          className={`flex flex-col gap-5 border-b-2 ${RULE} py-10 sm:border-r-2 sm:border-b-0 sm:pr-8 lg:col-span-3 lg:px-10 lg:py-14`}
        >
          <h2 id="footer-index-title" className={CELL_TITLE}>
            {content.indexTitle}
          </h2>
          <ul className="flex flex-col">
            {content.index.map((item) => (
              <li key={item.id}>
                <FooterLink href={item.href} label={item.label} index={item.index} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-5 py-10 sm:pl-8 lg:col-span-4 lg:py-14 lg:pl-10">
          <h2 className={CELL_TITLE}>{content.disciplinesTitle}</h2>
          <ul className="flex flex-col">
            {capabilities.map((capability) => (
              <li key={capability.id}>
                <FooterLink href={content.disciplinesHref} label={capability.label} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={`border-t-2 ${RULE}`}>
        <div className="shell flex flex-col gap-2 py-6 font-mono text-eyebrow text-ash/70 uppercase lg:flex-row lg:justify-between lg:gap-8 xl:grid xl:grid-cols-12 xl:gap-0 xl:py-0">
          <div className="flex flex-wrap gap-x-5 gap-y-2 xl:contents">
            <span className={`xl:col-span-5 xl:border-r-2 ${RULE} xl:py-6 xl:pr-10`}>
              © {year} {content.legalName}
            </span>
            <span className={`xl:col-span-3 xl:border-r-2 ${RULE} xl:px-10 xl:py-6`}>
              {content.rightsNotice}
            </span>
          </div>
          <span className="xl:col-span-4 xl:py-6 xl:pl-10">{content.signature}</span>
        </div>
      </div>
    </footer>
  );
}
