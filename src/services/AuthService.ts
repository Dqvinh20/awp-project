import axiosClient from '@/app/AxiosClient';
import {
  LoginResponse,
  RefreshTokenResponse,
  SignupResponse,
} from '@/types/authService';

/**
 * AuthService.ts.
 * @description Auth service use to login, signup and refresh token from the server.
 * @author Duong Quang Vinh <dqvinh20@clc.fitus.edu.vn>
 */
const authService = {
  /**
   * Sign in to the server.
   * @param email - User email.
   * @param password - User password.
   */
  async signin(email: string, password: string): Promise<LoginResponse> {
    const response: LoginResponse = await axiosClient.post('/auth/sign-in', {
      email,
      password,
    });
    return response;
  },

  /**
   * Sign up to the server.
   * @param email - User email.
   * @param password - User password.
   */
  async signup(email: string, password: string): Promise<SignupResponse> {
    const response: SignupResponse = await axiosClient.post('/auth/sign-up', {
      email,
      password,
    });
    return response;
  },

  /**
   * Refresh token from the server.
   */
  async refreshToken(): Promise<RefreshTokenResponse> {
    const response: RefreshTokenResponse = await axiosClient.post(
      '/auth/refresh',
      null,
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        withCredentials: true,
      }
    );
    return response;
  },
};

export default authService;
