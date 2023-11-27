import { useMutation } from '@tanstack/react-query';

import { SigninData, SignupData } from './interfaces';

import authService from '@/services/AuthService';
import jwtService from '@/services/JwtService';

/**
 * Sign in.
 * @returns
 */
export const useSignIn = () =>
  useMutation({
    mutationFn: (signinData: SigninData) =>
      authService.signin(signinData.email, signinData.password),
    retry: false,
    onSuccess(data) {
      jwtService.saveToken(data.access_token);
    },
  });

/**
 * Sign up.
 * @returns
 */
export const useSignUp = () =>
  useMutation({
    mutationFn: (signupData: SignupData) => authService.signup(signupData),
    retry: false,
    onSuccess(data) {
      jwtService.saveToken(data.access_token);
    },
  });

/**
 * User can forgot password.
 * @returns
 */
export const useForgotPassword = () =>
  useMutation({
    mutationFn: authService.forgotPassword,
    retry: false,
  });

/**
 * User can forgot password.
 * @returns
 */
export const useResetPassword = () =>
  useMutation({
    mutationFn: authService.resetPassword,
    retry: false,
  });

/** User can resend verification email. */
export const useResendEmailConfirmation = () =>
  useMutation({
    mutationFn: () => authService.resendEmailConfirmation(),
    retry: false,
  });

/** User can confirm their email. */
export const useConfirmEmail = () =>
  useMutation({
    mutationFn: (token: string) => authService.confirmEmail(token),
    retry: false,
  });
