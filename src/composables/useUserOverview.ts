import { getUserOverview } from '@/api/user'
import type { UserOverview } from '@/types'
import { useRequest } from 'alova'

export const useUserOverview = () => {
  const overview = shallowRef<UserOverview>()
  const request = useRequest(getUserOverview, { immediate: true })

  request.onSuccess((event) => {
    overview.value = event.data.data
  })

  const refresh = async () => {
    try {
      await request.send()
    } catch {
      // The request error remains exposed for the local retry state.
    }
  }

  return {
    overview: readonly(overview),
    loading: computed(() => request.loading.value),
    error: computed(() => request.error.value),
    refresh
  }
}
