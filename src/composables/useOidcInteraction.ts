import { completeOidcInteraction, getOidcInteraction } from '@/api/oauth'
import { useRequest } from 'alova'

export const useOidcInteraction = (uid: string) => {
  const interactionRequest = useRequest(getOidcInteraction(uid))
  const completeRequest = useRequest(
    (approved: boolean) => completeOidcInteraction(uid, approved),
    {
      immediate: false
    }
  )

  const complete = async (approved: boolean) => {
    try {
      const response = await completeRequest.send(approved)
      window.location.assign(response.data.continuationUrl)
    } catch {
      // The request error is exposed to the interaction view for an explicit retry.
    }
  }

  return {
    interaction: computed(() => interactionRequest.data.value?.data),
    loading: computed(() => interactionRequest.loading.value || completeRequest.loading.value),
    error: computed(() => interactionRequest.error.value || completeRequest.error.value),
    refresh: interactionRequest.send,
    complete
  }
}
