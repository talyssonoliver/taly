/**
 * Formats a number as a currency string in GBP (UK Currency).
 * @param amount - The amount to format.
 * @param locale - The locale string (default is 'en-GB' for UK format).
 * @param currency - The currency code (default is 'GBP' for British Pounds).
 * @returns The formatted currency string.
 */
export function formatCurrency(
  amount: number,
  locale = "en-GB",
  currency = "GBP"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Rounds a number to a specified number of decimal places.
 * @param value - The number to round.
 * @param decimals - The number of decimal places (default is 2).
 * @returns The rounded number.
 */
export function round(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/**
 * Generates a random number between min and max (inclusive).
 * @param min - The minimum number (inclusive).
 * @param max - The maximum number (inclusive).
 * @returns A random number within the specified range.
 */
export function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
