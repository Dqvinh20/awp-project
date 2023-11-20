import { User } from "../users/interfaces";

/**
 * ClassRoom DTO.
 * @property id - ClassRoom ID.
 * @property name - ClassRoom Name.
 * @property code - ClassRoom Code.
 * @property deleted_at - Address deleted time.
 * @interface Address
 */
export interface ClassRoom {
  /** ClassRoom ID. */
  id: string;
  /** ClassRoom name. */
  name: string;
  /** ClassRoom code. */
  code: string;
  /** ClassRoom code. */
  owner: User;
  /** ClassRoom deleted time. */
  deleted_at?: Date;
}
