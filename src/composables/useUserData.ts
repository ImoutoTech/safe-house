import { getUserData, validateToken } from '@/api/user'
import { useUserStore } from '@/stores/user'
import { useSerialRequest } from '@alova/scene-vue'

export const useUserData = (needRefresh = false) => {
  const userStore = useUserStore()
  const { loading, onSuccess, onError } = useSerialRequest(
    [validateToken, (res) => getUserData(res.data.id)],
    {
      immediate: userStore.hasLogin && needRefresh
    }
  )

  onSuccess((res) => {
    userStore.updateUserData(res.data.data)
  })

  onError(() => {
    userStore.updateUserData()
    userStore.updateToken()
  })

  return { hasLogin: userStore.hasLogin, loading, userData: userStore.userData }
}
