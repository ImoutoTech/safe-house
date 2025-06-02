import { getUserData, getUserPermissions, validateToken } from '@/api/user'
import { useUserStore } from '@/stores/user'
import { useSerialRequest } from '@alova/scene-vue'
import { useRequest } from 'alova'

export const useUserData = (needRefresh = false) => {
  const userStore = useUserStore()

  const { loading, onSuccess, onError } = useSerialRequest(
    [
      validateToken,
      (res) => getUserData(res.data.id)
    ],
    {
      immediate: userStore.hasLogin && needRefresh
    }
  )
  const {
    loading: permissionsLoading,
    onSuccess: onPermissionsSuccess,
    onError: onPermissionsError,
    send: sendPermissions
  } = useRequest(getUserPermissions, {
    immediate: false
  })

  onPermissionsSuccess((res) => {
    userStore.updateUserPermissions(res.data.data)
  })

  onPermissionsError(() => {
    userStore.updateUserPermissions([])
  })

  onSuccess((res) => {
    userStore.updateUserData(res.data.data)
    sendPermissions()
  })

  onError(() => {
    userStore.updateUserData()
    userStore.updateToken()
  })

  return {
    hasLogin: computed(() => userStore.hasLogin),
    loading: computed(() => loading.value || permissionsLoading.value),
    userData: computed(() => userStore.userData),
    userPermissions: computed(() => userStore.userPermissions)
  }
}
