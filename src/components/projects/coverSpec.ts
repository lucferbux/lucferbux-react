import { hash, rng } from "../../utils/seededRandom";

export type CoverMotif =
  "web" | "mobile" | "data" | "security" | "cloud" | "docs" | "generic";

/** Which picture a technology gets. Keys are lower-cased tags. */
const MOTIF_BY_TAG: Record<string, CoverMotif> = {
  react: "web",
  typescript: "web",
  javascript: "web",
  angular: "web",
  tailwind: "web",
  "micro-frontends": "web",
  swift: "mobile",
  swiftui: "mobile",
  ios: "mobile",
  macos: "mobile",
  kotlin: "mobile",
  android: "mobile",
  java: "mobile",
  python: "data",
  ai: "data",
  ia: "data",
  nlp: "data",
  ocr: "data",
  mlops: "data",
  kubeflow: "data",
  security: "security",
  "security research": "security",
  osint: "security",
  cryptokit: "security",
  go: "cloud",
  kubernetes: "cloud",
  openshift: "cloud",
  operators: "cloud",
  azure: "cloud",
  grpc: "cloud",
  firebase: "cloud",
  docs: "docs",
  teaching: "docs",
};

/**
 * The site's own colours: hero orange, hero light, body teal, deep teal. Three
 * of these are the banner script's; its dark-brown set is swapped for a warm
 * one, because at card size a near-black light reads as a stain, not a shadow.
 */
const PALETTES: ReadonlyArray<readonly [string, string, string]> = [
  ["#c98c31", "#eabe7d", "#007789"],
  ["#007789", "#5fa9b3", "#c98c31"],
  ["#c98c31", "#eabe7d", "#e07a55"],
  ["#00565f", "#007789", "#eabe7d"],
];

export interface CoverSpec {
  motif: CoverMotif;
  from: string;
  via: string;
  accent: string;
  /** Direction of the base gradient, in degrees. */
  angle: number;
  /** Soft lights laid over the gradient, positioned in percent. */
  glows: { x: number; y: number; color: string }[];
}

/**
 * Everything a project's generated cover is drawn from.
 *
 * Seeded from the title the caller passes — always the English one, so a
 * project wears the same cover in both languages. The motif comes from the
 * first tag that names a technology we have a picture for.
 */
export function coverSpec(title: string, tags: string[]): CoverSpec {
  const seed = hash(title);
  const random = rng(seed);
  const [from, via, accent] = PALETTES[seed % PALETTES.length];

  const motif =
    tags
      .map((tag) => MOTIF_BY_TAG[tag.toLowerCase()])
      .find((found) => found !== undefined) ?? "generic";

  return {
    motif,
    from,
    via,
    accent,
    angle: 110 + Math.round(random() * 70),
    glows: [via, accent, from].map((color) => ({
      x: Math.round(random() * 100),
      y: Math.round(random() * 100),
      color,
    })),
  };
}
