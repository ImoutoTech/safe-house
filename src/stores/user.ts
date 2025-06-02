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

export const useUserStore = defineStore(
  'user',
  () => {
    const access_token = ref('')
    const refresh_token = ref('')
    const userData = reactive<UserInfo>({ ...INIT_USER_DATA })
    const userPermissions = ref<string[]>([])

    const hasLogin = computed(() => !!refresh_token.value)

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

    const updateUserPermissions = (permissions: string[]) => {
      userPermissions.value = permissions
    }

    return {
      access_token,
      refresh_token,
      userData,
      hasLogin,
      userPermissions: readonly(userPermissions),
      updateToken,
      updateUserData,
      updateUserPermissions
    }
  },
  {
    persist: {
      key: 'sf-user'
    }
  }
)
