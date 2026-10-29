import type { Metadata } from "next";

import { SceneLab } from "@/features/scene";

export const metadata: Metadata = {
  title: "Lab",
  robots: { index: false, follow: false },
};

/**
 * Working surface for the hero scene. Kept out of search results.
 */
export default function LabPage() {
  return <SceneLab />;
}
