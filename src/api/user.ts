import type {
  LoginResult,
  Pagination,
  Restful,
  UserAvatarModifyParams,
  UserInfo,
  UserLoginParams,
  UserModifyParams,
  UserRegisterParams
} from '@/types'
import api from './api'

export const refreshToken = () => {
  const method = api.Get<Restful<{ token: string }>>('/user/refresh')
  method.meta = {
    authRole: 'refreshToken'
  }

  return method
}

export const getUserData = (id: number) => api.Get<Restful<UserInfo>>(`/user/${id}`)

export const userLogin = (data: UserLoginParams, md5 = true) =>
  api.Post<Restful<LoginResult>>(`/user/login?md5=${md5}`, data)

export const userRegister = (data: UserRegisterParams, md5 = true) =>
  api.Post<Restful<UserInfo>>(`/user/register?md5=${md5}`, data)

export const updateUserData = (id: number, data: UserModifyParams | UserAvatarModifyParams) =>
  api.Put<Restful<UserInfo>>(`/user/${id}`, data)

export const getAllUser = (page = 1, size = 10, search = '') =>
  api.Get<Restful<Pagination<UserInfo>>>(`/user/all`, {
    params: { page, size, search }
  })
