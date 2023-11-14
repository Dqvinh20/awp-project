import { jwtDecode } from 'jwt-decode';

import jwtService from '@/services/JwtService';

const useAuth = () => {
  const token = jwtService.getToken();

  if (token) {
    const decoded: any = jwtDecode(token);
    const { user_id } = decoded;
    return { user_id, hasToken: true };
  }

  return { user_id: null, hasToken: false };
};
export default useAuth;
