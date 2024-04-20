import { useMediaQuery } from '@vueuse/core'

export interface Config {
  title: string[]
  login: Record<'btn' | 'description', string>
  register: Record<'btn' | 'description', string>
}

const useStore = defineStore(
  'config',
  () => {
    const config = ref<Config>()

    const updateConfig = (data: Config) => (config.value = data)

    const isMobile = useMediaQuery('(max-width: 768px)')

    return {
      config,
      isMobile,
      updateConfig
    }
  },
  {
    persist: {
      key: 'sf-config'
    }
  }
)

export const useConfigStore = () => {
  const store = useStore()

  return {
    ...store,
    ...storeToRefs(store)
  }
}
