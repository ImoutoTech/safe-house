export interface UserInfo {
  id: number;
  nickname: string;
  email: string;
  avatar: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResult {
  token: string;
  refresh: string;
  user: UserInfo;
}

export interface UserLoginParams extends Record<string, string> {
  email: string;
  password: string;
}

export interface UserRegisterParams extends UserLoginParams {
  nickname: string;
}

export interface UserAppRegParams {
  callback: string;
  name: string;
  [key: string]: string;
}

export type UserAppUpdateParams = UserAppRegParams;

export interface UserModifyParams {
  email: string;
  nickname: string;
  [key: string]: string;
}
