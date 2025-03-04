/**
 * Capitalizes the first letter of a string.
 * @param text - The input string.
 * @returns The input string with the first letter capitalized.
 */
export function capitalizeFirstLetter(text: string): string {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Converts a string to kebab-case.
 * @param text - The input string.
 * @returns The input string converted to kebab-case.
 */
export function toKebabCase(text: string): string {
  return text
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

/**
 * Truncates a string to a specified length, adding an ellipsis if truncated.
 * @param text - The input string.
 * @param maxLength - The maximum length of the truncated string.
 * @returns The truncated string with an ellipsis if necessary.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Converts a string to a slug (URL-friendly format).
 * @param text - The input string.
 * @returns The input string converted to a slug.
 */
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
