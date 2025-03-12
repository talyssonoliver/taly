/**
 * Date utility functions for common date operations
 */
export class DateUtil {
  /**
   * Format a date to ISO string (YYYY-MM-DD)
   */
  static formatToISODate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Format a date to localized date string
   */
  static formatToLocalDate(date: Date, locale = 'en-US'): string {
    return date.toLocaleDateString(locale);
  }

  /**
   * Format a date to localized date and time string
   */
  static formatToLocalDateTime(date: Date, locale = 'en-US'): string {
    return date.toLocaleString(locale);
  }

  /**
   * Add days to a date
   */
  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Add months to a date
   */
  static addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  /**
   * Add years to a date
   */
  static addYears(date: Date, years: number): Date {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
  }

  /**
   * Get the difference in days between two dates
   */
  static getDaysDifference(date1: Date, date2: Date): number {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Check if a date is in the past
   */
  static isPast(date: Date): boolean {
    return date.getTime() < new Date().getTime();
  }

  /**
   * Check if a date is in the future
   */
  static isFuture(date: Date): boolean {
    return date.getTime() > new Date().getTime();
  }

  /**
   * Check if a date is today
   */
  static isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  /**
   * Get the start of a day (midnight)
   */
  static startOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  /**
   * Get the end of a day (23:59:59.999)
   */
  static endOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  }
}
