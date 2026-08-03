import { getAdminProviders, updateAdminProvider } from '@/api/oauth'
import type { ExternalProvider, ProviderUpdate } from '@/types'
import { useRequest } from 'alova'

export const useProviderAdmin = () => {
  const listRequest = useRequest(getAdminProviders)
  const saveRequest = useRequest(
    ({ provider, data }: { provider: ExternalProvider; data: ProviderUpdate }) =>
      updateAdminProvider(provider, data),
    { immediate: false }
  )
  const message = useMessage()

  const save = async (provider: ExternalProvider, draft: ProviderUpdate) => {
    const data = { ...draft }
    if (!data.clientSecret?.trim()) delete data.clientSecret
    try {
      await saveRequest.send({ provider, data })
      await listRequest.send()
      message.success('配置已保存')
    } catch (error) {
      message.error(error instanceof Error ? error.message : '配置保存失败')
    }
  }

  return {
    providers: computed(() => listRequest.data.value?.data ?? []),
    loading: computed(() => listRequest.loading.value || saveRequest.loading.value),
    error: computed(() => listRequest.error.value || saveRequest.error.value),
    refresh: listRequest.send,
    save
  }
}
