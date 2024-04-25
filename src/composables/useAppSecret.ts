import {
  createUserAppSecret,
  delUserAppSecret,
  getUserAppSecret,
  switchUserAppSecret
} from '@/api/app'
import { useRequest } from 'alova'

export const useAppSecret = () => {
  const app = ref('')
  const toggleLoading = ref(false)
  const createLoading = ref(false)
  const deleteLoading = ref(false)
  const msg = useMessage()

  const {
    loading: listLoading,
    data,
    send
  } = useRequest(() => getUserAppSecret(app.value), {
    immediate: false
  })

  const loading = computed(
    () => toggleLoading.value || createLoading.value || deleteLoading.value || listLoading.value
  )

  const toggle = async (id: number) => {
    toggleLoading.value = true
    return switchUserAppSecret(app.value, id)
      .then((res) => {
        return res
      })
      .finally(() => {
        toggleLoading.value = false
      })
  }

  const create = async () => {
    createLoading.value = true
    return createUserAppSecret(app.value)
      .then((res) => {
        msg.success('创建成功')
        return res
      })
      .finally(() => {
        createLoading.value = false
      })
  }

  const del = async (id: number) => {
    deleteLoading.value = true
    return delUserAppSecret(app.value, id)
      .then((res) => {
        msg.success('删除成功')
        return res
      })
      .finally(() => {
        deleteLoading.value = false
      })
  }

  const refresh = () => {
    if (app.value) {
      send()
    }
  }

  const updateApp = (id: string) => {
    app.value = id
    refresh()
  }

  return {
    app,
    data,
    listLoading,
    loading,
    toggleLoading,
    createLoading,
    deleteLoading,
    updateApp,
    refresh,
    toggle,
    create,
    del
  }
}
