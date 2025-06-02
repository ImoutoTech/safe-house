import { createAlova } from 'alova'
import VueHook from 'alova/vue'
import { axiosRequestAdapter } from '@alova/adapter-axios'
import { createServerTokenAuthentication } from '@alova/scene-vue'
import { ENV } from '@/utils/constants'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _axios from 'axios'
import { useUserStore } from '@/stores/user'
import { BUSINESS_ERROR_CODE } from '@reus-able/const'
import { refreshToken } from './user'

const { onAuthRequired, onResponseRefreshToken } = createServerTokenAuthentication<
  typeof VueHook,
  typeof axiosRequestAdapter
>({
  refreshTokenOnError: {
    isExpired: (error, method) => {
      return (
        error.response.data.code === BUSINESS_ERROR_CODE.EXPIRED_TOKEN &&
        method.meta?.authRole !== 'refreshToken'
      )
    },

    handler: async () => {
      const res = await refreshToken()
      const userStore = useUserStore()
      console.log('token刷新成功')
      userStore.updateToken(res.data.token, userStore.refresh_token)
    }
  }
})

const alovaInstance = createAlova({
  statesHook: VueHook,
  requestAdapter: axiosRequestAdapter(),
  baseURL: ENV.API_URL,
  beforeRequest: onAuthRequired((method) => {
    const userStore = useUserStore()

    if (userStore.access_token) {
      method.config.headers.Authorization = `${userStore.access_token}`
    }

    if (method.meta && method.meta.authRole === 'refreshToken' && userStore.refresh_token) {
      method.config.headers.Authorization = `${userStore.refresh_token}`
    }
  }),
  responded: onResponseRefreshToken({
    onSuccess: (res) => {
      return res.data
    },
    onError: (e) => {
      if (e.response.data.code === BUSINESS_ERROR_CODE.ACCESS_FORBIDDEN) {
        throw new Error('无权限')
      }

      if (e.response.data.code === BUSINESS_ERROR_CODE.EXPIRED_TOKEN) {
        const userStore = useUserStore()
        userStore.updateToken()
        userStore.updateUserData()
      }

      throw new Error(e?.response?.data?.msg || e)
    }
  }),
  localCache: null
})

export default alovaInstance
