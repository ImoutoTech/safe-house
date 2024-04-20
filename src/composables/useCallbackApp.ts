import { GetUserAppData, callbackUserApp } from '@/api/app'
import { useCallbackStore } from '@/stores/callback'
import { useRequest } from 'alova'

export const useCallbackApp = (id: string) => {
  const msg = useMessage()
  const { app, updateApp } = useCallbackStore()
  const {
    loading: appLoading,
    onSuccess: onLoaded,
    onError: onLoadError
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
    msg.error(e.error.message)
  }

  onLoaded((res) => {
    updateApp(res.data.data)
  })

  onSuccess((res) => {
    const ticket = res.data.data.ticket
    const url = app.value.callback
    window.location.href = `${url}?ticket=${ticket}`
  })

  onLoadError(handleError)
  onError(handleError)

  return { app, appLoading, cbLoading, send }
}
