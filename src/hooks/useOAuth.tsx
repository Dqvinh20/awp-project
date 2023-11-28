import { useParams } from 'react-router-dom';

import { useGetMyInfo } from '@/app/store/server/features/users/queries';
import jwtService from '@/services/JwtService';

/**
 * @description
 * This hook is used to handle OAuth login flow.
 * */
export default function useOAuth() {
  const { accessToken } = useParams();
  jwtService.saveToken(accessToken ?? '');
  const query = useGetMyInfo();
  return query;
}
