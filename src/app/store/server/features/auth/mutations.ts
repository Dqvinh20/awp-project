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
      window.location.href = '/home';
    },
  });

// eslint-disable-next-line jsdoc/require-jsdoc
export const useSignUp = () =>
  useMutation({
    mutationFn: (signupData: SignupData) => authService.signup(signupData),
    retry: false,
    onSuccess(data) {
      jwtService.saveToken(data.access_token);
      window.location.href = '/home';
    },
  });
