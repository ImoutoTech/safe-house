import { exchangeExternalResult, getEnabledProviders, startExternalLogin } from '@/api/oauth'
import type { ExternalCallbackOutcome, ExternalProvider } from '@/types'
import { useRequest } from 'alova'

export const normalizeLocalReturnTo = (value: unknown, fallback = '/user') => {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return fallback

  const target = new URL(value, window.location.origin)
  if (target.origin !== window.location.origin) return fallback
  return `${target.pathname}${target.search}${target.hash}`
}

export const useExternalLogin = () => {
  const providersRequest = useRequest(getEnabledProviders)
  const startRequest = useRequest(
    ({ provider, returnTo }: { provider: ExternalProvider; returnTo: string }) =>
      startExternalLogin(provider, returnTo),
    { immediate: false }
  )
  const message = useMessage()

  const enabledProviders = computed(() =>
    (providersRequest.data.value?.data ?? []).filter((item) => item.enabled)
  )

  const start = async (provider: ExternalProvider, returnTo: string) => {
    try {
      const response = await startRequest.send({ provider, returnTo })
      window.location.assign(response.data.authorizationUrl)
    } catch (error) {
      message.error(error instanceof Error ? error.message : '无法发起外部登录')
    }
  }

  return {
    providers: enabledProviders,
    loading: computed(() => providersRequest.loading.value || startRequest.loading.value),
    error: computed(() => providersRequest.error.value || startRequest.error.value),
    start
  }
}

export const useExternalCallback = () => {
  const outcome = shallowRef<ExternalCallbackOutcome | null>(null)
  const callbackRequest = useRequest((id: string) => exchangeExternalResult(id), {
    immediate: false
  })

  const finish = async (id: string) => {
    const response = await callbackRequest.send(id)
    outcome.value = response.data
    return outcome.value
  }

  return {
    outcome: readonly(outcome),
    loading: callbackRequest.loading,
    error: callbackRequest.error,
    finish
  }
}
