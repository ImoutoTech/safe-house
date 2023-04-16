import type { AxiosResponse } from "axios";
export interface ENVData {
  TITLE: string;
  API_URL: string;
  MODE: string;
  PROD: boolean;
  LOCALHOST_PREFIX: string;
  PROXY_URL: string;
  [key: string]: string | boolean;
}

export interface UserInfo {
  id: number;
  nickname: string;
  email: string;
  avatar: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface TokenInfo {
  email: string;
  role: string;
  id: number;
  iat: number;
  exp: number;
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

export type UserModifyParams = UserRegisterParams;

export interface Restful<T> {
  code: 0 | 100;
  msg: string;
  data: T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AxiosResult<T> = Promise<AxiosResponse<Restful<T>, any>>;
