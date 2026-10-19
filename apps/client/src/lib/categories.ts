/**
 * Canonical destination category slugs.
 * MUST match the category seed on the server (apps/server/prisma/seed/categories.ts).
 * Filter UI must only use these slugs, otherwise the API returns empty results.
 */
export const CATEGORY_SLUGS = [
  "volcanes",
  "playas",
  "reservas",
  "colonial",
  "aventura",
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];
