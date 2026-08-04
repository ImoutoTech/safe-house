import { createAlova } from 'alova'
import VueHook from 'alova/vue'
import { axiosRequestAdapter } from '@alova/adapter-axios'
import axios from 'axios'
import { ENV } from '@/utils/constants'

const configApi = createAlova({
  statesHook: VueHook,
  requestAdapter: axiosRequestAdapter({
    axios: axios.create({ withCredentials: false })
  }),
  baseURL: ENV.CONFIG_URL,
  responded: (response) => response.data,
  localCache: null
})

export const getDynamicConfig = <T = unknown>(slug: string) =>
  configApi.Get<T>('/config/get', {
    params: { slug }
  })
