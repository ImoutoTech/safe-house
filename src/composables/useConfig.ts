import { getDynamicConfig } from '@/api/config'
import { type Config, useConfigStore } from '@/stores/config'
import { useRequest } from 'alova'

export const useConfig = (needRefresh = false) => {
  const { loading, onSuccess } = useRequest(getDynamicConfig<Config>('safe-house-index'), {
    immediate: needRefresh
  })
  const { config, updateConfig } = useConfigStore()

  onSuccess((res) => {
    updateConfig(res.data)
  })

  return { loading, config }
}
