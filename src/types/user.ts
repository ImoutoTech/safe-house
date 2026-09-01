import { UserRole } from '@reus-able/types'
import type { ExternalProvider } from './oauth'

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

export interface UserOverviewIdentity {
  id: number
  provider: ExternalProvider
  email: string | null
  displayName: string | null
  avatarUrl: string | null
  createdAt: string
}

export interface UserOverviewAccount {
  email: string
  createdAt: string
  updatedAt: string
  emailVerified: boolean
  hasPassword: boolean
  identities: readonly UserOverviewIdentity[]
}

export interface UserOverviewApps {
  total: number
  running: number
  closed: number
  banned: number
  loginSucceeded: number
  consentApproved: number
  consentDenied: number
}

export interface UserOverview {
  windowDays: number
  account: UserOverviewAccount
  apps: UserOverviewApps | null
}

export type UserActivityCategory = 'account' | 'identity' | 'oidc' | 'subapp'

export type UserActivityAction =
  | 'login_succeeded'
  | 'login_failed'
  | 'profile_updated'
  | 'email_changed'
  | 'password_changed'
  | 'identity_bound'
  | 'identity_unbound'
  | 'consent_decided'
  | 'created'
  | 'updated'
  | 'status_changed'
  | 'deleted'
  | 'secret_created'
  | 'secret_status_changed'
  | 'secret_deleted'

export type UserActivityOutcome = 'success' | 'failure' | 'approved' | 'denied'

export interface UserActivityTarget {
  type: 'subapp' | 'identity'
  id?: string
  name: string
}

export interface UserActivityItem {
  id: string
  category: UserActivityCategory
  action: UserActivityAction
  outcome: UserActivityOutcome
  summary: string
  detail?: string
  target?: UserActivityTarget
  occurredAt: string
}

export interface UserActivityPage {
  items: UserActivityItem[]
  count: number
  total: number
  page: number
  size: number
  hasMore: boolean
}
