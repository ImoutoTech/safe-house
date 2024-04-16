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
    const access_token = ref('')
    const refresh_token = ref('')
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
