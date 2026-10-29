"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";

import { LogoMark } from "@/components/brand/logo-mark";
import manifest from "@/content/scene-manifest.json";
import { PageLoader } from "@/features/intro";
import { cn } from "@/lib/cn";

import { RocketScene } from "./rocket-scene";

/** Tempo presets offered on the review page. */
const SPEEDS = [0.25, 0.5, 1, 2] as const;

/**
 * A segmented control button in the lab's toolbar.
 */
function ToolButton({
  active,
  onClick,
  children,
}: {
  readonly active: boolean;
  readonly onClick: () => void;
  readonly children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "border-2 px-3 py-1.5 font-mono text-eyebrow uppercase transition-colors",
        active
          ? "border-volt bg-volt text-void"
          : "border-chalk/15 text-ash hover:border-chalk/40 hover:text-chalk",
      )}
    >
      {children}
    </button>
  );
}

/**
 * Review page for the rocket scene: the scene at full width with playback,
 * tempo and a reference overlay, followed by every piece it is built from.
 * It can also replay the page loader, which otherwise only runs on a full load.
 */
export function SceneLab() {
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [reference, setReference] = useState(false);
  const [intro, setIntro] = useState(0);

  const pieces = Object.entries(manifest);

  return (
    <main id="main" className="shell flex flex-col gap-10 py-10 lg:py-14">
      <header className="flex flex-col gap-6">
        <div className="flex items-center justify-between font-mono text-eyebrow text-ash uppercase">
          <span className="text-volt">p2s / lab</span>
          <Link href="/" className="transition-colors hover:text-chalk">
            Site ↗
          </Link>
        </div>

        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="flex flex-col gap-3">
            <h1 className="font-display text-section leading-[0.9] text-chalk uppercase">Rocket scene</h1>
            <p className="max-w-xl text-ash">
              Assembled from {pieces.length} separate pieces and animated in CSS. Toggle the reference to
              check the composition against the original illustration.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div role="group" aria-label="Playback" className="flex gap-1">
              <ToolButton active={!paused} onClick={() => setPaused((current) => !current)}>
                {paused ? "Play" : "Pause"}
              </ToolButton>
              <ToolButton active={reference} onClick={() => setReference((current) => !current)}>
                Reference
              </ToolButton>
              <ToolButton active={false} onClick={() => setIntro((current) => current + 1)}>
                Replay intro
              </ToolButton>
            </div>
            <div role="group" aria-label="Speed" className="flex gap-1">
              {SPEEDS.map((option) => (
                <ToolButton key={option} active={speed === option} onClick={() => setSpeed(option)}>
                  {option}×
                </ToolButton>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="relative aspect-[1672/941] border-2 border-chalk/10">
        <RocketScene paused={paused} speed={speed} />
        {reference ? (
          <Image
            src="/scene/reference.jpg"
            alt="Reference illustration"
            fill
            sizes="100vw"
            className="pointer-events-none z-[90] object-cover opacity-50"
          />
        ) : null}
      </div>

      <section aria-labelledby="pieces-heading" className="flex flex-col gap-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-t-2 border-chalk/10 pt-6">
          <h2 id="pieces-heading" className="font-display text-display text-chalk uppercase">
            Pieces
          </h2>
          <p className="font-mono text-eyebrow text-ash uppercase">
            public/scene · bun run scene:prepare
          </p>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {pieces.map(([name, piece]) => (
            <li key={name} className="flex flex-col border-2 border-chalk/10 bg-carbon">
              <div className="relative aspect-square bg-abyss">
                <Image src={piece.src} alt={name} fill sizes="200px" className="object-contain p-3" />
              </div>
              <div className="flex flex-col gap-1 p-3 font-mono text-eyebrow uppercase">
                <span className="truncate text-chalk normal-case">{name}</span>
                <span className="text-ash">
                  {piece.width}×{piece.height}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
      {intro > 0 ? (
        <PageLoader
          key={intro}
          logo={<LogoMark id={`lab-logo-${intro}`} fillable />}
          always
        />
      ) : null}
    </main>
  );
}
