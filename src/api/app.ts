import type {
  AppCallbackResult,
  AppInfo,
  Pagination,
  Restful,
  UserAppRegParams,
  UserAppUpdateParams
} from '@/types'
import API from './api'

export const GetUserApp = (page = 1, size = 500, search = '') =>
  API.Get<Restful<Pagination<AppInfo>>>(`/app/my`, {
    params: { page, size, search }
  })

export const delUserApp = (id: string) => API.Delete<Restful<Record<string, never>>>(`/app/${id}`)

export const regUserApp = (data: UserAppRegParams) => API.Post<Restful<AppInfo>>(`/app/reg`, data)

export const updateUserApp = (id: string, data: UserAppUpdateParams) =>
  API.Put<Restful<AppInfo>>(`/app/${id}`, data)

export const GetUserAppData = (id: string) => API.Get<Restful<AppInfo>>(`/app/${id}`)

export const callbackUserApp = (id: string) => API.Post<Restful<AppCallbackResult>>(`/app/${id}`)
