import type { Restful, UserInfo } from '@/types'
import api from './api'

export const refreshToken = () => {
  const method = api.Get<Restful<{ token: string }>>('/user/refresh')
  method.meta = {
    authRole: 'refreshToken'
  }

  return method
}

export const getUserData = (id: number) => api.Get<Restful<UserInfo>>(`/user/${id}`)
