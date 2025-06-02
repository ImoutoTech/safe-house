import { GetUserAppData, authorizeUserApp } from '@/api/app'
import { useCallbackStore } from '@/stores/callback'
import type { AuthorizeParam } from '@/types'
import { useRequest } from 'alova'

export const useAuthorizeApp = (id: string, state: string, redirect: string) => {
  const msg = useMessage()
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
  } = useRequest((data: AuthorizeParam) => authorizeUserApp(data), {
    immediate: false
  })

  const authorize = () => {
    send({
      client_id: id,
      redirect_uri: redirect,
      state
    })
  }

  const handleError = (e: any) => {
    msg.error(e.error.message)
  }

  onLoaded((res) => {
    callbackStore.updateApp(res.data.data)
  })

  onSuccess((res) => {
    window.location.href = `${redirect}?code=${res.data.data.access_token}&state=${res.data.data.state}`
  })

  onLoadError(handleError)
  onError(handleError)

  return {
    app: computed(() => callbackStore.app),
    appLoading,
    cbLoading,
    appError,
    updateApp: callbackStore.updateApp,
    authorize
  }
}
