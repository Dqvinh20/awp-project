import { USER_ROLE, User } from '../users/interfaces';

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

/**
 * Invite members to class by email.
 * @interface InviteMembersByEmailDTO
 */
export interface InviteMembersByEmailDTO {
  /** ClassRoom Code. */
  code: string;
  /** List of user emails will be invited. */
  invited_emails: string[];
}

/**
 * Kick member out class.
 * @interface KickMembersDTO
 */
export interface KickMembersDTO {
  /** ClassRoom ID. */
  class_id: string;
  /** List of user id will be kicked. */
  users_id: string[];
  /** Their role in class. */
  role: USER_ROLE.Teacher | USER_ROLE.Student;
}
