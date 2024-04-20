import type { AppInfo } from '@/types'
import { isNil } from 'lodash-es'

const useStore = defineStore(
  'callback',
  () => {
    const app = ref<AppInfo>()

    const isCallback = computed(() => !isNil(app.value))

    const updateConfig = (data?: AppInfo) => (app.value = data)

    return {
      app,
      isCallback,
      updateConfig
    }
  },
  {
    persist: false
  }
)

export const useCallbackStore = () => {
  const store = useStore()

  return {
    ...store,
    ...storeToRefs(store)
  }
}
