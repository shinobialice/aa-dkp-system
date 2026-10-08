export const PROMO_SLUGS = ["marathon"] as const;

export type PromoSlug = (typeof PROMO_SLUGS)[number];

export type PromoLink = { title: string; url: string };

export function isPromoSlug(value: string): value is PromoSlug {
  return PROMO_SLUGS.some((slug) => slug === value);
}

export function promoPath(slug: PromoSlug) {
  return `/promo/${slug}`;
}
