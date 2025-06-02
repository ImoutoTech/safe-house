import { AppStatus, type AppInfo } from '@/types'
import { isNil } from 'lodash-es'

const INIT_DATA = {
  name: '加载中',
  id: '',
  callback: '',
  owner: '',
  description: '',
  visitNum: 0,
  created_at: '',
  updated_at: '',
  meta: {
    status: AppStatus.RUNNING,
    visitNum: 0
  }
}

export const useCallbackStore = defineStore(
  'callback',
  () => {
    const app = ref<AppInfo>({ ...INIT_DATA })

    const isCallback = computed(() => !!app.value.id)

    const updateApp = (data?: AppInfo) => {
      app.value = isNil(data) ? { ...INIT_DATA } : { ...data }
    }

    return {
      app,
      isCallback,
      updateApp
    }
  },
  {
    persist: false
  }
)
