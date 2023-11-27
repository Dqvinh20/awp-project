import { ResetPasswordDto } from './../app/store/server/features/auth/interfaces';

import axiosClient from '@/app/AxiosClient';
import { SignupData } from '@/app/store/server/features/auth/interfaces';
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
    const response = await axiosClient.post('/auth/sign-in', {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Sign up to the server.
   * @param signupData - Signup data.
   * @see {@link SignupData}.
   * @returns
   */
  async signup(signupData: SignupData): Promise<SignupResponse> {
    const response = await axiosClient.post('/auth/sign-up', signupData);
    return response.data;
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

  logout() {
    return axiosClient.post('/auth/log-out');
  },

  async forgotPassword(email: string): Promise<any> {
    const response = await axiosClient.get(`/users/forgot-password/${email}`);
    return response.data;
  },

  async resetPassword({ token, new_password }: ResetPasswordDto): Promise<any> {
    const response = await axiosClient.patch(`/users/reset-password/${token}`, {
      new_password,
    });
    return response.data;
  },

  async resendEmailConfirmation(): Promise<any> {
    const response = await axiosClient.post(`/email-confirmation/resend`);
    return response.data;
  },

  async confirmEmail(token: string): Promise<any> {
    const response = await axiosClient.post(
      `/email-confirmation/confirm`,
      token
    );
    return response.data;
  },
};

export default authService;
