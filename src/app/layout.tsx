import type { Metadata, Viewport } from "next";

import { LogoMark } from "@/components/brand/logo-mark";
import { MotionProvider } from "@/components/providers/motion-provider";
import { BlueprintBackdrop } from "@/components/ui/blueprint-backdrop";
import { GrainOverlay } from "@/components/ui/grain-overlay";
import { fontVariables } from "@/design-system/fonts";
import { CustomCursor } from "@/features/cursor";
import { INTRO_BOOT_SCRIPT, IntroProvider, PageLoader } from "@/features/intro";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "p2s — Software, automation and AI engineering",
    template: "%s — p2s",
  },
  description:
    "p2s designs, builds and operates custom software, mobile apps, automations, AI integrations and cloud infrastructure.",
  applicationName: "p2s",
  keywords: [
    "software development",
    "mobile apps",
    "automation",
    "process engineering",
    "AI integration",
    "cloud infrastructure",
  ],
};

export const viewport: Viewport = {
  themeColor: "#0e0f12",
  colorScheme: "dark",
};

/**
 * Root document shell.
 *
 * Exposes the font custom properties on the document element so the theme layer
 * can reference them, and installs the shared motion configuration and grain
 * overlay around every route.
 *
 * The page loader opens the first full load of each visit. A blocking script
 * in the head, run before the first paint, skips it on every later full load
 * of the same visit (reloads, or navigations Next.js completes with a full
 * load), which is why the document element's attributes are allowed to differ
 * from the server's at hydration. From the first paint,
 * `data-loader` locks scrolling until the loader has gone and
 * `data-intro="pending"` holds CSS entrance animations until it lifts. Without
 * JavaScript the loader would never lift, so it is hidden, scrolling unlocked
 * and those animations released outright.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-intro="pending"
      data-loader="active"
      className={`${fontVariables} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_BOOT_SCRIPT }} />
      </head>
      <body className="relative min-h-dvh">
        <BlueprintBackdrop />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:rounded-brutal focus:bg-volt focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-void focus:uppercase"
        >
          Skip to content
        </a>

        <noscript>
          <style>
            {".page-loader{display:none}html[data-loader]{overflow:auto}html[data-intro] .scene-launch{animation-play-state:running}"}
          </style>
        </noscript>

        <MotionProvider>
          <IntroProvider>
            {children}
            <PageLoader logo={<LogoMark id="loader-logo" fillable />} />
          </IntroProvider>
          <CustomCursor />
        </MotionProvider>
        <GrainOverlay />
      </body>
    </html>
  );
}
