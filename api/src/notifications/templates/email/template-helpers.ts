/**
 * Handlebars helpers for email templates
 */

/**
 * Format date in a user-friendly way
 * @example {{formatDate date "MM/DD/YYYY"}}
 */
export type FormatDateFn = (date: Date | string, format: string) => string;

exports.formatDate = (date: Date | string, format: string): string => {
  if (!date) return '';
  
  // You can use a library like moment.js or date-fns here
  // For simplicity, we'll just do a basic formatting
  const d: Date = new Date(date);
  
  const pad = (num: number): string => num.toString().padStart(2, '0');
  
  const yyyy: number = d.getFullYear();
  const mm: string = pad(d.getMonth() + 1);
  const dd: string = pad(d.getDate());
  
  if (format === 'MM/DD/YYYY') {
    return `${mm}/${dd}/${yyyy}`;
  }
  if (format === 'YYYY-MM-DD') {
    return `${yyyy}-${mm}-${dd}`;
  }
  
  return d.toLocaleDateString();
};

/**
 * Format time in a user-friendly way
 * @example {{formatTime time "h:mm A"}}
 */
exports.formatTime = (time: Date | string, format: string) => {
  if (!time) return '';
  
  // Check if time is a date object or a string
  let d: Date;
  if (time instanceof Date) {
    d = time;
  } else if (typeof time === 'string') {
    // Check if it's a full date string or just time
    if (time.includes('T') || time.includes('-') || time.includes('/')) {
      d = new Date(time);
    } else {
      // Assume it's just HH:MM in 24-hour format
      const [hours, minutes] = time.split(':').map(Number);
      d = new Date();
      d.setHours(hours, minutes, 0, 0);
    }
  } else {
    return '';
  }
  
  type PadFunction = (num: number) => string;
  
  const pad: PadFunction = (num: number): string => num.toString().padStart(2, '0');
  
  const hours24 = d.getHours();
  const hours12 = hours24 % 12 || 12;
  const minutes = pad(d.getMinutes());
  const ampm = hours24 < 12 ? 'AM' : 'PM';
  
  if (format === 'h:mm A') {
    return `${hours12}:${minutes} ${ampm}`;
  }
  if (format === 'HH:mm') {
    return `${pad(hours24)}:${minutes}`;
  }
  
  return d.toLocaleTimeString();
};

/**
 * Format currency
 * @example {{formatCurrency amount currency}}
 */
export type FormatCurrencyFn = (amount: number | null | undefined, currency?: string) => string;

exports.formatCurrency = (amount: number | null | undefined, currency = 'USD') => {
  if (amount === undefined || amount === null) return '';
  
  try {
    return new Intl.NumberFormat('en-UK', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  } catch (error: unknown) {
    return "";
  }
};

/**
 * Conditional block helper
 * @example {{#ifEquals value1 value2}}...{{else}}...{{/ifEquals}}
 */
exports.ifEquals = function(arg1: unknown, arg2: unknown, options: { fn(context?: unknown): string; inverse(context?: unknown): string; }) {
  return arg1 === arg2 ? options.fn(this) : options.inverse(this);
};

/**
 * Capitalize first letter of each word
 * @example {{titleCase text}}
 */
exports.titleCase = (text: string) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
