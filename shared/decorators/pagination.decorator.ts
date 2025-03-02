import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import { SystemConstants } from "../../../../shared/constants/system-constants";

/**
 * A decorator to extract pagination parameters from the request query.
 * Supports `page` and `limit` parameters with default and max values.
 *
 * Example usage:
 * @Get('items')
 * getItems(@Pagination() { page, limit }: PaginationParams) {
 *   return `Page: ${page}, Limit: ${limit}`;
 * }
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

export const Pagination = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): PaginationParams => {
    const request = ctx.switchToHttp().getRequest();
    const {
      page = SystemConstants.DEFAULT_PAGE_NUMBER,
      limit = SystemConstants.DEFAULT_PAGE_SIZE,
    } = request.query;

    return {
      page: Math.max(Number.parseInt(page, 10) || 1, 1),
      limit: Math.min(
        Math.max(Number.parseInt(limit, 10) || 10, 1),
        SystemConstants.MAX_PAGE_SIZE
      ),
    };
  }
);
