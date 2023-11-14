import { JwtPayload } from 'jwt-decode';

/**
 * JwtPayload.
 * JWT decoded payload interface.
 * @interface AppJwtPayload
 */
export interface AppJwtPayload extends JwtPayload {
  /** Logged user id. */
  user_id: string | null;
}
