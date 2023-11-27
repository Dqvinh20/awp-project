/* eslint-disable jsdoc/require-jsdoc */
export interface SigninData {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
}

export interface ResetPasswordDto {
  token: string;
  new_password: string;
}
