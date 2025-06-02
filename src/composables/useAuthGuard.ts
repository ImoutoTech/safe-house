import { useUserStore } from '../stores/user'

export const useAuthGuard = () => {
  const userStore = useUserStore()
  const router = useRouter()

  watch(
    () => userStore.hasLogin,
    (val, old) => {
      if (old && !val) {
        router.push('/')
      }
    }
  )
}
