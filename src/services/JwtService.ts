/**
 * JwtService.ts.
 * @description Jwt service use to save, get and remove token from sessionStorage.
 * @author Duong Quang Vinh <dqvinh20@clc.fitus.edu.vn>
 */
const jwtService = {
  /**
   * Save token to sessionStorage.
   * @param token - Access token.
   * @returns
   */
  saveToken(token: string): void {
    sessionStorage.setItem('token', token);
  },

  /**
   * Get token from sessionStorage.
   * @returns
   */
  getToken(): string | null {
    return sessionStorage.getItem('token');
  },

  /**
   * Remove token from sessionStorage.
   * @returns
   */
  removeToken(): void {
    sessionStorage.removeItem('token');
  },
};

export default jwtService;
