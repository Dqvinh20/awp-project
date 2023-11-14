/**
 * User DTO.
 * @interface User
 */
export interface User {
  /** User ID. */
  id: string;
  /** User first name. */
  first_name?: string;
  /** User last name. */
  last_name?: string;
  /** User full name. */
  full_name?: string;
  /** User email. */
  email: string;
  /** User avatar. */
  avatar?: string;
  /** User Address.
   * @see {@link Address}.
   */
  address: Address[];
  /** Created time. */
  created_at?: Date;
  /** Updated time. */
  updated_at?: Date;
  /** Deleted time. */
  deleted_at?: Date;
}

/**
 * Address DTO.
 * @property id - Address ID.
 * @property street - Address street.
 * @property state - Address state.
 * @property city - Address city.
 * @property postal_code - Address postal code.
 * @property country - Address country.
 * @property deleted_at - Address deleted time.
 * @interface Address
 */
export interface Address {
  /** Address ID. */
  id: string;
  /** Address street. */
  street?: string;
  /** Address state. */
  state?: string;
  /** Address city. */
  city?: string;
  /** Address postal code. */
  postal_code?: number | string;
  /** Address country. */
  country?: string;
  /** Address deleted time. */
  deleted_at?: Date;
}
