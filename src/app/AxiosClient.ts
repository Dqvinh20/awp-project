import axios, { AxiosError, AxiosRequestHeaders } from 'axios';
import Cookies from 'js-cookie';

import { API_URL } from '@/config/index';
import jwtService from '@/services/JwtService';
import authService from '@/services/AuthService';

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': import.meta.env.DEV
      ? 'http://localhost:4200'
      : 'https://awp_project.hausuper-s.me',
  },
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  (requestConfig) => {
    const token = jwtService.getToken();

    requestConfig.headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    } as AxiosRequestHeaders;

    return requestConfig;
  },
  (error) => {
    console.error('@AxiosClient', error.response);
    return Promise.reject(error);
  }
);

/**
 * Create an Axios interceptor to handle the response.
 * If the response status code is 401 or 403, refresh the access token.
 * If no access token is found, reject the request.
 * If the refresh token is expired, remove the access token and redirect to sign in page.
 * @returns
 */
function createAxiosResponseInterceptor(): void {
  const interceptor = axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (!error.response) {
        return Promise.reject(error);
      }

      const {
        response: { config, status },
      } = error;

      // Reject if the error status is not 401 or 403
      if (status !== 401 && status !== 403) {
        return Promise.reject(error);
      }

      // Reject if the error message is not 'Unauthorized'
      if (
        error.response.data.message !== 'Unauthorized' ||
        config.url === '/auth/refresh'
      ) {
        return Promise.reject(error);
      }

      /*
       * When response code is 401 or 403, try to refresh the token.
       * Eject the interceptor so it doesn't loop in case
       * token refresh causes the 401 response.
       *
       * Must be re-attached later on or the token refresh will only happen once
       */
      axios.interceptors.response.eject(interceptor);

      // Access token was expired
      // Refresh the access token
      return authService
        .refreshToken()
        .then((refreshResponse) => {
          // Save the new access token
          jwtService.saveToken(refreshResponse.data.access_token);
          config.headers.Authorization = `Bearer ${refreshResponse.data.access_token}`;
          return axiosClient(config);
        })
        .catch((refreshError: AxiosError) => {
          if (refreshError?.response?.status === 401) {
            // Remove the access token and redirect to sign in page
            Cookies.remove('Refresh');
            jwtService.removeToken();
            window.location.replace('/sign-in?error=expired');
          }
          return Promise.reject(refreshError);
        })
        .finally(createAxiosResponseInterceptor);
    }
  );
}

createAxiosResponseInterceptor();

export default axiosClient;
