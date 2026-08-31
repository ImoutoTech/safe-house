import { GetUserAppData, callbackUserApp } from '@/api/app'
import { useCallbackStore } from '@/stores/callback'
import { useRequest } from 'alova'
import { useFeedback } from './useFeedback'

export const useCallbackApp = (id: string) => {
  const feedback = useFeedback()
  const callbackStore = useCallbackStore()
  const {
    loading: appLoading,
    onSuccess: onLoaded,
    onError: onLoadError,
    error: appError
  } = useRequest(GetUserAppData(id))

  const {
    loading: cbLoading,
    send,
    onSuccess,
    onError
  } = useRequest(callbackUserApp(id), {
    immediate: false
  })

  const handleError = (e: any) => {
    feedback.error(e.error.message)
  }

  onLoaded((res) => {
    callbackStore.updateApp(res.data.data)
  })

  onSuccess((res) => {
    const ticket = res.data.data.ticket
    const url = callbackStore.app.callback
    window.location.href = `${url}?ticket=${ticket}`
  })

  onLoadError(handleError)
  onError(handleError)

  return {
    app: computed(() => callbackStore.app),
    appLoading,
    cbLoading,
    appError,
    updateApp: callbackStore.updateApp,
    send
  }
}
