/**
 * Report types
 */
export enum ReportType {
  APPOINTMENT = 'appointment',
  REVENUE = 'revenue',
  CLIENT = 'client',
  STAFF_PERFORMANCE = 'staff_performance',
  INVENTORY = 'inventory',
  MARKETING = 'marketing',
}

/**
 * Report output formats
 */
export enum ReportFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  CSV = 'csv',
  JSON = 'json',
  HTML = 'html',
}

/**
 * Report status values
 */
export enum ReportStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  EXPIRED = 'expired',
}

/**
 * Report period types
 */
export enum ReportPeriodType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUAL = 'annual',
  CUSTOM = 'custom',
}

/**
 * Report chart types
 */
export enum ReportChartType {
  BAR = 'bar',
  LINE = 'line',
  PIE = 'pie',
  DOUGHNUT = 'doughnut',
  AREA = 'area',
  SCATTER = 'scatter',
  BUBBLE = 'bubble',
  RADAR = 'radar',
  POLAR = 'polar',
  HEATMAP = 'heatmap',
}

/**
 * Report permissions
 */
export enum ReportPermission {
  VIEW = 'report:view',
  CREATE = 'report:create',
  DOWNLOAD = 'report:download',
  SCHEDULE = 'report:schedule',
  SHARE = 'report:share',
  DELETE = 'report:delete',
}

/**
 * Report scheduling frequencies
 */
export enum ReportScheduleFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
}

/**
 * Maximum report retention period in days
 */
export const MAX_REPORT_RETENTION_DAYS = 90;

/**
 * Default date ranges for reports
 */
export const DEFAULT_DATE_RANGES = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  THIS_WEEK: 'this_week',
  LAST_WEEK: 'last_week',
  THIS_MONTH: 'this_month',
  LAST_MONTH: 'last_month',
  THIS_QUARTER: 'this_quarter',
  LAST_QUARTER: 'last_quarter',
  THIS_YEAR: 'this_year',
  LAST_YEAR: 'last_year',
  LAST_30_DAYS: 'last_30_days',
  LAST_90_DAYS: 'last_90_days',
  LAST_12_MONTHS: 'last_12_months',
  CUSTOM: 'custom',
};

/**
 * Maximum size for report files (in bytes)
 */
export const MAX_REPORT_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Default page size for reports with pagination
 */
export const DEFAULT_REPORT_PAGE_SIZE = 50;

/**
 * Maximum records per report
 */
export const MAX_RECORDS_PER_REPORT = 10000;

/**
 * Report file name pattern
 * Available placeholders:
 * - {reportType} - Type of report
 * - {date} - Current date (YYYY-MM-DD)
 * - {time} - Current time (HH-MM-SS)
 * - {dateRange} - Date range in format YYYY-MM-DD_to_YYYY-MM-DD
 */
export const REPORT_FILENAME_PATTERN = '{reportType}-report-{date}';

/**
 * Default locale for report formatting
 */
export const DEFAULT_REPORT_LOCALE = 'en-US';

/**
 * Default date format for reports
 */
export const DEFAULT_DATE_FORMAT = 'MM/DD/YYYY';

/**
 * Default time format for reports
 */
export const DEFAULT_TIME_FORMAT = 'hh:mm A';

/**
 * Currency options for reports
 */
export const REPORT_CURRENCY_OPTIONS = {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

/**
 * Default report generation timeout (in milliseconds)
 */
export const REPORT_GENERATION_TIMEOUT = 5 * 60 * 1000; // 5 minutes

/**
 * Default sorting options for reports
 */
export const DEFAULT_REPORT_SORTING = {
  APPOINTMENTS: { field: 'date', direction: 'desc' },
  REVENUE: { field: 'amount', direction: 'desc' },
  CLIENTS: { field: 'createdAt', direction: 'desc' },
  STAFF: { field: 'name', direction: 'asc' },
};

/**
 * Report notification events
 */
export enum ReportNotificationEvent {
  REPORT_READY = 'report.ready',
  REPORT_FAILED = 'report.failed',
  REPORT_SCHEDULED = 'report.scheduled',
  REPORT_EXPIRING = 'report.expiring',
}

/**
 * Status color mapping for consistent UI representation
 */
export const REPORT_STATUS_COLORS = {
  [ReportStatus.PENDING]: '#FFC107', // Amber
  [ReportStatus.PROCESSING]: '#2196F3', // Blue
  [ReportStatus.COMPLETED]: '#4CAF50', // Green
  [ReportStatus.FAILED]: '#F44336', // Red
  [ReportStatus.EXPIRED]: '#9E9E9E', // Grey
};

/**
 * Maximum concurrent report generation limit
 */
export const MAX_CONCURRENT_REPORT_GENERATIONS = 5;

/**
 * Report categories for organization
 */
export const REPORT_CATEGORIES = {
  OPERATIONS: 'operations',
  FINANCIAL: 'financial',
  MARKETING: 'marketing',
  CUSTOMER: 'customer',
  STAFF: 'staff',
  INVENTORY: 'inventory',
};
