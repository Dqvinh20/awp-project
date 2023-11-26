import { User } from '../users/interfaces';

/**
 * ClassRoom DTO.
 * @property id - ClassRoom ID.
 * @property name - ClassRoom Name.
 * @property code - ClassRoom Code.
 * @property deleted_at - Address deleted time.
 * @interface Address
 */
export interface ClassDTO {
  /** ClassRoom ID. */
  id: string;
  /** ClassRoom name. */
  name: string;
  /** ClassRoom description. */
  description: string;
  /** ClassRoom code. */
  code: string;
  /** ClassRoom students. */
  students: User[];
  /** ClassRoom teachers. */
  teachers: User[];
  /** ClassRoom code. */
  owner: User;
  /** Class can join or not. */
  isJoinable: boolean;
  /** ClassRoom public join link. */
  public_invitation_link?: string;
  /** ClassRoom created time. */
  created_at?: Date;
  /** ClassRoom updated time. */
  updated_at?: Date;
  /** ClassRoom deleted time. */
  deleted_at?: Date;
}

/**
 * Create new class room.
 * @interface AddClassDTO
 */
export interface AddClassDTO {
  /** ClassRoom name. */
  name: string;
  /** ClassRoom description. */
  description?: string;
}
