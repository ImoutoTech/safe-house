import { useRequest } from 'alova'
import { waitBackend } from '@/api/common'

export const useBackendInit = () => {
  const { loading } = useRequest(waitBackend(), {
    immediate: true
  })

  return { loading }
}
