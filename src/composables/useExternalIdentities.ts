import {
  bindExternalIdentity,
  getLinkedIdentities,
  startExternalBinding,
  unbindExternalIdentity
} from '@/api/oauth'
import type { ExternalProvider } from '@/types'
import { useRequest } from 'alova'
import { useFeedback } from './useFeedback'

export const useExternalIdentities = () => {
  const listRequest = useRequest(getLinkedIdentities)
  const bindRequest = useRequest((token: string) => bindExternalIdentity(token), {
    immediate: false
  })
  const unbindRequest = useRequest((id: number) => unbindExternalIdentity(id), { immediate: false })
  const startRequest = useRequest(
    ({ provider, returnTo }: { provider: ExternalProvider; returnTo: string }) =>
      startExternalBinding(provider, returnTo),
    { immediate: false }
  )
  const feedback = useFeedback()

  const identities = computed(() => listRequest.data.value?.data ?? [])

  const bind = async (token: string) => {
    await bindRequest.send(token)
    await listRequest.send()
    feedback.success('身份绑定成功')
  }

  const unbind = async (id: number) => {
    try {
      await unbindRequest.send(id)
      await listRequest.send()
      feedback.success('已解绑身份')
    } catch (error) {
      feedback.error(error instanceof Error ? error.message : '解绑失败')
      return false
    }
    return true
  }

  const startBinding = async (provider: ExternalProvider, returnTo: string) => {
    try {
      const response = await startRequest.send({ provider, returnTo })
      window.location.assign(response.data.authorizationUrl)
    } catch (error) {
      feedback.error(error instanceof Error ? error.message : '无法发起身份绑定')
    }
  }

  return {
    identities,
    loading: computed(
      () =>
        listRequest.loading.value ||
        bindRequest.loading.value ||
        unbindRequest.loading.value ||
        startRequest.loading.value
    ),
    error: computed(() => listRequest.error.value || startRequest.error.value),
    refresh: listRequest.send,
    bind,
    unbind,
    startBinding
  }
}
