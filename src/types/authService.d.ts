/**
 * The response from the login endpoint.
 * @exports
 * @interface LoginResponse
 */
export interface LoginResponse {
  /**
   * @type {string}
   * @memberof LoginResponse
   */
  access_token: string;
  /**
   * @type {string}
   * @memberof LoginResponse
   */
  refresh_token: string;
}

/**
 * The response from the refresh token endpoint.
 * @exports
 * @interface RefreshTokenResponse
 * @augments LoginResponse
 * @see {@link LoginResponse}.
 */
export type RefreshTokenResponse = Pick<LoginResponse, 'access_token'>;

/**
 * The response from the signup endpoint.
 * @exports
 * @interface SignupResponse
 * @augments LoginResponse
 * @see {@link LoginResponse}.
 */
export type SignupResponse = LoginResponse;
