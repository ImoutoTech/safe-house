import { useUserStore } from '@/stores/user'

export const useHasPermission = (permission: string) => {
  const userStore = useUserStore()

  return userStore.userPermissions.includes(permission)
}