import { getUserData, validateToken } from '@/api/user'
import { useUserStore } from '@/stores/user'
import { useSerialRequest } from '@alova/scene-vue'

export const useUserData = (needRefresh = false) => {
  const { userData, hasLogin, updateUserData } = useUserStore()
  const { loading, onSuccess } = useSerialRequest(
    [validateToken, (res) => getUserData(res.data.id)],
    {
      immediate: hasLogin.value && needRefresh
    }
  )

  onSuccess((res) => {
    updateUserData(res.data.data)
  })

  return { hasLogin, loading, userData }
}
