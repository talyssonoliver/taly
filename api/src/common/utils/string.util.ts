/**
 * String utility functions for common string operations
 */
export class StringUtil {
  /**
   * Capitalize the first letter of a string
   */
  static capitalize(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Capitalize the first letter of each word in a string
   */
  static titleCase(str: string): string {
    if (!str) return str;
    return str
      .toLowerCase()
      .split(' ')
      .map(word => this.capitalize(word))
      .join(' ');
  }

  /**
   * Convert a string to camelCase
   */
  static toCamelCase(str: string): string {
    if (!str) return str;
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => {
        return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
      })
      .replace(/\s+/g, '');
  }

  /**
   * Convert a string to snake_case
   */
  static toSnakeCase(str: string): string {
    if (!str) return str;
    return str
      .replace(/\s+/g, '_')
      .replace(/([A-Z])/g, '_')
      .toLowerCase()
      .replace(/^_/, '');
  }

  /**
   * Convert a string to kebab-case
   */
  static toKebabCase(str: string): string {
    if (!str) return str;
    return str
      .replace(/\s+/g, '-')
      .replace(/([A-Z])/g, '-')
      .toLowerCase()
      .replace(/^-/, '');
  }

  /**
   * Truncate a string to a specified length and add an ellipsis if needed
   */
  static truncate(str: string, length: number, ellipsis = '...'): string {
    if (!str) return str;
    if (str.length <= length) return str;
    return str.slice(0, length) + ellipsis;
  }

  /**
   * Remove special characters from a string
   */
  static removeSpecialChars(str: string): string {
    if (!str) return str;
    return str.replace(/[^\w\s]/gi, '');
  }

  /**
   * Check if a string is a valid email format
   */
  static isValidEmail(email: string): boolean {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Generate a random string of specified length
   */
  static generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
