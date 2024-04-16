import type { UserInfo } from '@/types'
import { isNil } from 'lodash-es'
import { UserRole } from '@reus-able/types'

const INIT_USER_DATA: UserInfo = {
  id: 0,
  nickname: '',
  email: '',
  avatar: '',
  role: UserRole.USER,
  created_at: '',
  updated_at: ''
}

const useStore = defineStore(
  'user',
  () => {
    const access_token = ref(
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InlvdXJhbnJldXN0dEBxcS5jb20iLCJyb2xlIjoxLCJpZCI6NTMsInJlZnJlc2giOmZhbHNlLCJpYXQiOjE3MDczODk3MTUsImV4cCI6MTcwNzM5NjkxNX0.FU2xbu0UboC_uHw7c47VMyRb7apT4dkXHqQxsc_xWlU'
    )
    const refresh_token = ref(
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InlvdXJhbnJldXNAcXEuY29tIiwicm9sZSI6MCwiaWQiOjI2LCJyZWZyZXNoIjp0cnVlLCJpYXQiOjE3MTMwMjU5NDEsImV4cCI6MTcxMzYzMDc0MX0.yDgQXXYunsfOnkrMD3eddLNtAYQQ8Yno0usyf_e3cdo'
    )
    const userData = reactive<UserInfo>({ ...INIT_USER_DATA })

    const updateToken = (access = '', refresh = '') => {
      access_token.value = access
      refresh_token.value = refresh
    }

    const updateUserData = (data?: UserInfo) => {
      const newData = isNil(data) ? { ...INIT_USER_DATA } : data

      Object.assign(userData, {
        ...newData
      })
    }

    return {
      access_token: readonly(access_token),
      refresh_token: readonly(refresh_token),
      userData: readonly(userData),
      updateToken,
      updateUserData
    }
  },
  {
    persist: {
      key: 'sf-user'
    }
  }
)

export const useUserStore = () => {
  const store = useStore()

  return {
    ...store,
    ...storeToRefs(store)
  }
}
