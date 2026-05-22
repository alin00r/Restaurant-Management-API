import { TinyPaginationDto } from '../types/pagination.tiny.dto';

export const DEFAULT_PAGE_LIMIT = 10;
export const DEFAULT_PAGE_OFFSET = 0;

export interface NormalizedPagination {
  offset: number;
  limit: number;
}


export function normalizePagination(
  pagination?: Partial<TinyPaginationDto>
): NormalizedPagination {
  return {
    offset: pagination?.offset ?? DEFAULT_PAGE_OFFSET,
    limit: pagination?.limit ?? DEFAULT_PAGE_LIMIT
  };
}
