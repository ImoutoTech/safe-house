import { UserRole } from '@reus-able/types'

export interface UserInfo {
  id: number
  nickname: string
  email: string
  avatar: string
  role: UserRole
  created_at: string
  updated_at: string
  emailVerified: boolean
  hasPassword: boolean
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
  verificationProof: string
}

export interface UserModifyParams {
  nickname: string
  avatar: string
}

export type EmailVerificationPurpose = 'register' | 'change_email' | 'change_password'

export interface EmailChallengeResult {
  challengeId: string
  expiresAt: string
  resendAt: string
}

export interface EmailProofResult {
  verificationProof: string
}

export interface ChangeEmailParams {
  email: string
  verificationProof: string
}

export interface ChangePasswordParams {
  oldVal?: string
  newVal: string
  verificationProof: string
}
