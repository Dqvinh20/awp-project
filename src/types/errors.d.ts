/**
 * Error response interface.
 * @exports
 * @interface ErrorResponse
 */
export interface ErrorResponse {
  /**
   * @type {number}
   * @memberof ErrorResponse
   * @description Status code of the error.
   * @example
   * 400
   * 401
   * 403
   */
  statusCode: number;
  /**
   * @type {string}
   * @memberof ErrorResponse
   * @description Error message.
   * @example
   * "Email is required."
   * "Password is required."
   * "Unauthorized"
   */
  message: string;
}
