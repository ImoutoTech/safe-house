import { getDynamicConfig } from '@/api/config'
import { type Config, useConfigStore } from '@/stores/config'
import { useRequest } from 'alova'
import { isNil } from 'lodash-es'

export const useConfig = (needRefresh = false) => {
  const { config, updateConfig } = useConfigStore()
  const { loading, onSuccess } = useRequest(getDynamicConfig<Config>('safe-house-index'), {
    immediate: needRefresh || isNil(config.value)
  })

  onSuccess((res) => {
    updateConfig(res.data)
  })

  return { loading, config }
}
