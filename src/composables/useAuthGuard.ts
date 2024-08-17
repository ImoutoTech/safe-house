import { useUserStore } from '../stores/user'

export const useAuthGuard = () => {
  const { hasLogin } = useUserStore()
  const router = useRouter()

  watch(
    () => hasLogin.value,
    (val, old) => {
      if (old && !val) {
        router.push('/')
      }
    }
  )
}
