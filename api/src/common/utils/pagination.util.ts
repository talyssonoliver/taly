import { PaginatedResult } from '../interfaces/paginated-result.interface';

/**
 * Pagination utility functions
 */
export class PaginationUtil {
  /**
   * Create a paginated result
   */
  static createPaginatedResult<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedResult<T> {
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;
    
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext,
        hasPrevious,
      },
    };
  }

  /**
   * Calculate pagination values (skip and take) for database queries
   */
  static getPaginationValues(
    page: number,
    limit: number,
  ): { skip: number; take: number } {
    const normalizedPage = Math.max(1, page);
    const normalizedLimit = Math.max(1, limit);
    
    return {
      skip: (normalizedPage - 1) * normalizedLimit,
      take: normalizedLimit,
    };
  }

  /**
   * Validate and normalize pagination parameters
   */
  static normalizePaginationParams(
    page: number | string = 1,
    limit: number | string = 10,
    maxLimit = 100,
  ): { page: number; limit: number } {
    let pageNum = typeof page === 'string' ? parseInt(page, 10) : page;
    let limitNum = typeof limit === 'string' ? parseInt(limit, 10) : limit;
    
    // Ensure valid values
    pageNum = isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;
    limitNum = isNaN(limitNum) || limitNum < 1 ? 10 : limitNum;
    
    // Cap the limit
    limitNum = Math.min(limitNum, maxLimit);
    
    return { page: pageNum, limit: limitNum };
  }
}
