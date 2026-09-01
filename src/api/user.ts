import type {
  LoginResult,
  Pagination,
  Restful,
  UserInfo,
  UserLoginParams,
  UserModifyParams,
  UserRegisterParams,
  EmailChallengeResult,
  EmailProofResult,
  EmailVerificationPurpose,
  ChangeEmailParams,
  ChangePasswordParams,
  UserOverview,
  UserActivityCategory,
  UserActivityPage
} from '@/types'
import api from './api'
import type { UserJwtPayload } from '@reus-able/types'

export const refreshToken = () => {
  const method = api.Get<Restful<{ token: string }>>('/user/refresh')
  method.meta = {
    authRole: 'refreshToken'
  }

  return method
}

export const getUserData = (id: number) => api.Get<Restful<UserInfo>>(`/user/${id}`)

export const validateToken = () => api.Get<Restful<UserJwtPayload>>(`/user/validate`)

export const userLogin = (data: UserLoginParams, md5 = true) =>
  api.Post<Restful<LoginResult>>(`/user/login?md5=${md5}`, data)

export const userRegister = (data: UserRegisterParams, md5 = true) =>
  api.Post<Restful<UserInfo>>(`/user/register?md5=${md5}`, data)

export const updateUserData = (id: number, data: Partial<UserModifyParams>) =>
  api.Put<Restful<UserInfo>>(`/user/${id}`, data)

export const getAllUser = (page = 1, size = 10, search = '') =>
  api.Get<Restful<Pagination<UserInfo>>>(`/user/all`, {
    params: { page, size, search }
  })

export const getUserPermissions = () => api.Get<Restful<string[]>>(`/user/permission`)

export const createEmailChallenge = (data: { purpose: EmailVerificationPurpose; email?: string }) =>
  api.Post<Restful<EmailChallengeResult>>('/user/email-verification/challenges', data)

export const verifyEmailChallenge = (challengeId: string, code: string) =>
  api.Post<Restful<EmailProofResult>>(`/user/email-verification/challenges/${challengeId}/verify`, {
    code
  })

export const changeUserEmail = (id: number, data: ChangeEmailParams) =>
  api.Put<Restful<UserInfo>>(`/user/${id}/email`, data)

export const changeUserPassword = (id: number, data: ChangePasswordParams, md5 = true) =>
  api.Put<Restful<UserInfo>>(`/user/${id}/password?md5=${md5}`, data)

export const getUserOverview = () => api.Get<Restful<UserOverview>>('/user/me/overview')

export const getUserActivity = (page = 1, size = 20, category?: UserActivityCategory) =>
  api.Get<Restful<UserActivityPage>>('/user/me/activity', {
    params: { page, size, ...(category ? { category } : {}) }
  })
