/**
 * Pagination params for api call.
 * @interface PaginationParams
 */
export interface PaginationParams {
  /**
   * Selected fields.
   * @type {string}
   * @memberof PaginationParams
   */
  select?: string;
  /**
   * Current query page.
   * @type {string}
   * @memberof PaginationParams
   */
  page?: number;
  /**
   * Current page size.
   * @type {string}
   * @memberof PaginationParams
   */
  limit?: number;
  /**
   * Sort by.
   * @type {string}
   * @memberof PaginationParams
   */
  sort?: string;
  /**
   * Current query page.
   * @type {boolean}
   * @memberof PaginationParams
   */
  pagination?: boolean;
}

export interface PaginationResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: string;
  nextPage: string;
}

export const defaultPaginationParams: PaginationParams = {
  page: 1,
  limit: 10,
  pagination: true,
  sort: '-updated_at',
};
