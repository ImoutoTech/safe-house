import { getAdminProviders, updateAdminProvider } from '@/api/oauth'
import type { ExternalProvider, ProviderUpdate } from '@/types'
import { projectAdminProviders } from '@/utils/providerAdmin'
import { useRequest } from 'alova'
import { useFeedback } from './useFeedback'

export const useProviderAdmin = (immediate = true) => {
  const listRequest = useRequest(getAdminProviders, { immediate })
  const saveRequest = useRequest(
    ({ provider, data }: { provider: ExternalProvider; data: ProviderUpdate }) =>
      updateAdminProvider(provider, data),
    { immediate: false }
  )
  const feedback = useFeedback()

  const save = async (provider: ExternalProvider, draft: ProviderUpdate) => {
    const data = { ...draft }
    if (!data.clientSecret?.trim()) delete data.clientSecret
    try {
      await saveRequest.send({ provider, data })
      await listRequest.send()
      feedback.success('配置已保存')
    } catch (error) {
      feedback.error(error instanceof Error ? error.message : '配置保存失败')
    }
  }

  return {
    providers: computed(() => projectAdminProviders(listRequest.data.value?.data ?? [])),
    loading: computed(() => listRequest.loading.value || saveRequest.loading.value),
    error: computed(() => listRequest.error.value || saveRequest.error.value),
    refresh: listRequest.send,
    save
  }
}
