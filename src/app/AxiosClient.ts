import axios, { AxiosRequestHeaders } from 'axios';

import { API_URL } from '@/config/index';
import jwtService from '@/services/JwtService';
import authService from '@/services/AuthService';

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:4200',
    // crossDomain: true /
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
    (response) => response.data,
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

      // If there is no access token
      // Reject the request immediately
      // Cause it means the user is not logged in
      if (!jwtService.getToken()) {
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
      authService
        .refreshToken()
        .then((refreshResponse) => {
          // Save the new access token
          jwtService.saveToken(refreshResponse.access_token);
          config.headers.Authorization = `Bearer ${refreshResponse.access_token}`;
          return axiosClient(config);
        })
        .catch((refreshError) => {
          // Remove the access token and redirect to sign in page
          jwtService.removeToken();
          window.location.href = '/sign-in';
          return Promise.reject(refreshError);
        })
        .finally(createAxiosResponseInterceptor);

      return Promise.reject(error);
    }
  );
}

createAxiosResponseInterceptor();

export default axiosClient;
