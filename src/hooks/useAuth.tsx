import { jwtDecode } from 'jwt-decode';

import jwtService from '@/services/JwtService';
import { AppJwtPayload } from '@/types/jwt';

const useAuth = (): AppJwtPayload => {
  const token = jwtService.getToken();

  if (token) {
    const decoded = jwtDecode<AppJwtPayload>(token);
    return decoded;
  }

  return { user_id: null };
};
export default useAuth;
