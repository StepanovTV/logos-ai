const MIN_USAGE_PRICE_PER_M = 1;
const USAGE_PRICE_MARKUP = 1.5;

/**
 * Calculates LOGOS usage price from OpenRouter completion (output) price.
 * Free models → $1/M; paid models → +50%, minimum $1/M.
 */
export function calculateUsagePricePerM(
  openRouterCompletionPricePerM: number,
): number {
  let price: number;

  if (openRouterCompletionPricePerM <= 0) {
    price = MIN_USAGE_PRICE_PER_M;
  } else {
    price = Math.max(
      openRouterCompletionPricePerM * USAGE_PRICE_MARKUP,
      MIN_USAGE_PRICE_PER_M,
    );
  }

  return Math.round(price * 100) / 100;
}

/**
 * Formats usage price for display on model cards.
 */
export function formatUsagePricePerM(price: number | null | undefined): string {
  const normalizedPrice =
    typeof price === "number" && Number.isFinite(price)
      ? price
      : MIN_USAGE_PRICE_PER_M;

  const formatted =
    normalizedPrice >= 10
      ? normalizedPrice.toFixed(2)
      : normalizedPrice.toFixed(2).replace(/\.?0+$/, "") || "0";

  return `$${formatted}/M`;
}
