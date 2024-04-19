import { UserRole } from '@reus-able/types'

export interface UserInfo {
  id: number
  nickname: string
  email: string
  avatar: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface LoginResult {
  token: string
  refresh: string
  user: UserInfo
}

export interface UserLoginParams {
  email: string
  password: string
}

export interface UserRegisterParams extends UserLoginParams {
  nickname: string
}

export interface UserModifyParams {
  email: string
  nickname: string
  avatar: string
}
