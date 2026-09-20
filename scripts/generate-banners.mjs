#!/usr/bin/env node
/**
 * Generate a banner image per blog post.
 *
 * The output is deterministic: every shape, colour and position is derived from
 * a hash of the post slug, so re-running produces byte-identical files and a
 * given post always gets the same banner. The palette is the site's own
 * (#c98c31 → #eabe7d → #007789), so the banners sit alongside the wave
 * backgrounds rather than against them.
 *
 *   node scripts/generate-banners.mjs            # all posts
 *   node scripts/generate-banners.mjs --slug x   # one post
 *
 * Writes SVG to content/banners/. Rasterisation to PNG/WebP is a separate step
 * (scripts/rasterize-banners.mjs) so this one has no native dependencies.
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const WIDTH = 1200;
const HEIGHT = 630;
// Served directly by Netlify and precached by the service worker, so posts
// need no Storage round trip. scripts/upload-banners.mjs can mirror them to
// Firebase Storage if you would rather host them there.
const OUT_DIR = resolve(process.cwd(), "public/images/banners");
const CONTENT_DIR = resolve(process.cwd(), "src/content");

/** Site palette: hero orange, hero light, body teal, deep teal. */
const PALETTES = [
  ["#c98c31", "#eabe7d", "#007789"],
  ["#007789", "#b0c4c7", "#c98c31"],
  ["#a08153", "#eabe7d", "#2b2830"],
  ["#00565f", "#007789", "#eabe7d"],
];

/** FNV-1a: small, stable, and identical across Node versions. */
function hash(text) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

/** Deterministic PRNG seeded from the slug. */
function rng(seed) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

/**
 * A closed blob as a cubic Bézier loop, so the shapes look organic rather than
 * like circles — matching the wave motif used across the site.
 */
function blobPath(cx, cy, radius, points, wobble, random) {
  const angles = [];
  for (let i = 0; i < points; i += 1) {
    const angle = (i / points) * Math.PI * 2;
    const r = radius * (1 - wobble / 2 + random() * wobble);
    angles.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
  }

  let d = `M ${angles[0].x.toFixed(1)} ${angles[0].y.toFixed(1)}`;
  for (let i = 0; i < angles.length; i += 1) {
    const current = angles[i];
    const next = angles[(i + 1) % angles.length];
    const midX = (current.x + next.x) / 2;
    const midY = (current.y + next.y) / 2;
    d += ` Q ${current.x.toFixed(1)} ${current.y.toFixed(1)} ${midX.toFixed(1)} ${midY.toFixed(1)}`;
  }
  return `${d} Z`;
}

function escapeXml(text) {
  return text.replace(
    /[<>&'"]/g,
    (char) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;",
      })[char]
  );
}

/** Break a title into lines that fit, measuring roughly by character width. */
function wrap(title, maxChars) {
  const words = title.split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    if (line.length + word.length + 1 > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

export function buildBanner({ slug, title, kicker }) {
  const seed = hash(slug);
  const random = rng(seed);
  const [from, via, accent] = PALETTES[seed % PALETTES.length];

  const blobs = Array.from({ length: 7 }, (_, i) => {
    const cx = random() * WIDTH;
    const cy = random() * HEIGHT;
    const radius = 120 + random() * 200;
    const fill = [from, via, accent][i % 3];
    const opacity = (0.3 + random() * 0.3).toFixed(2);
    return `<path d="${blobPath(cx, cy, radius, 7, 0.55, random)}" fill="${fill}" opacity="${opacity}" />`;
  }).join("\n    ");

  const fontSize = title.length > 46 ? 58 : title.length > 30 ? 68 : 78;
  const lines = wrap(title, title.length > 46 ? 30 : 26);
  const startY = HEIGHT / 2 - ((lines.length - 1) * fontSize * 1.18) / 2 + 12;

  const titleLines = lines
    .map(
      (line, i) =>
        `<text x="80" y="${(startY + i * fontSize * 1.18).toFixed(0)}" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="${fontSize}" font-weight="700" fill="#ffffff">${escapeXml(line)}</text>`
    )
    .join("\n    ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-label="${escapeXml(title)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}" />
      <stop offset="55%" stop-color="${via}" />
      <stop offset="100%" stop-color="${accent}" />
    </linearGradient>
    <filter id="soften" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="28" />
    </filter>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" />
  <g filter="url(#soften)">
    ${blobs}
  </g>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#000000" opacity="0.20" />

  <text x="80" y="${startY - fontSize * 0.95}" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="24" font-weight="600" letter-spacing="3" fill="#ffffff" opacity="0.85">${escapeXml(kicker.toUpperCase())}</text>
  ${titleLines}
  <text x="80" y="${HEIGHT - 64}" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="26" font-weight="600" fill="#ffffff" opacity="0.85">lucferbux.dev</text>
</svg>
`;
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return {};
  const data = {};
  for (const line of match[1].split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf(":");
    if (idx === -1) continue;
    let value = trimmed.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    data[trimmed.slice(0, idx).trim()] = value;
  }
  return data;
}

/** News entries live in the seed corpus rather than in markdown. */
function collectNews() {
  const path = resolve(process.cwd(), "content/seed/intro.json");
  let rows;
  try {
    rows = JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return [];
  }
  return rows.map((row) => ({
    slug: row._id,
    title: row.title?.en ?? row.title?.es ?? row._id,
    kicker: "News",
  }));
}

function collectPosts() {
  const posts = new Map();
  for (const locale of ["en", "es"]) {
    const dir = join(CONTENT_DIR, locale);
    let files = [];
    try {
      files = readdirSync(dir).filter((f) => f.endsWith(".md"));
    } catch {
      continue;
    }
    for (const file of files) {
      const data = parseFrontmatter(readFileSync(join(dir, file), "utf8"));
      if (!data.slug) continue;
      const slug = data.slug.replace(/^\//, "");
      // English titles win for the banner when both exist, so a post has one
      // banner rather than one per language.
      if (!posts.has(slug) || locale === "en") {
        posts.set(slug, {
          slug,
          title: data.title,
          kicker: data.kicker ?? "Article",
        });
      }
    }
  }
  return [...posts.values()];
}

const only = process.argv.includes("--slug")
  ? process.argv[process.argv.indexOf("--slug") + 1]
  : null;

mkdirSync(OUT_DIR, { recursive: true });

const posts = [...collectPosts(), ...collectNews()].filter(
  (p) => !only || p.slug === only
);
if (posts.length === 0) {
  console.error(only ? `No post with slug "${only}"` : "No posts found");
  process.exit(1);
}

for (const post of posts) {
  const svg = buildBanner(post);
  writeFileSync(join(OUT_DIR, `${post.slug}.svg`), svg);
  console.log(`  ${post.slug}.svg  ${post.title}`);
}

console.log(
  `\n${posts.length} banner${posts.length === 1 ? "" : "s"} in public/images/banners/`
);
