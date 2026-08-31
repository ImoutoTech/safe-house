import {
  createUserAppSecret,
  delUserAppSecret,
  getUserAppSecret,
  switchUserAppSecret
} from '@/api/app'
import { useRequest } from 'alova'
import { useFeedback } from './useFeedback'

export const useAppSecret = () => {
  const app = ref('')
  const toggleLoading = ref(false)
  const createLoading = ref(false)
  const deleteLoading = ref(false)
  const feedback = useFeedback()

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

  const refresh = async () => {
    if (!app.value) return
    try {
      await send()
    } catch (error) {
      feedback.error(error instanceof Error ? error.message : 'Client Secret 加载失败')
    }
  }

  const toggle = async (id: number) => {
    toggleLoading.value = true
    try {
      const response = await switchUserAppSecret(app.value, id)
      void refresh()
      return response
    } catch (error) {
      feedback.error(error instanceof Error ? error.message : '凭据状态更新失败')
      return null
    } finally {
      toggleLoading.value = false
    }
  }

  const create = async () => {
    createLoading.value = true
    try {
      const response = await createUserAppSecret(app.value)
      void refresh()
      return response.data.value
    } catch (error) {
      feedback.error(error instanceof Error ? error.message : 'Client Secret 创建失败')
      return null
    } finally {
      createLoading.value = false
    }
  }

  const del = async (id: number) => {
    deleteLoading.value = true
    try {
      const response = await delUserAppSecret(app.value, id)
      feedback.success('删除成功')
      void refresh()
      return response
    } catch (error) {
      feedback.error(error instanceof Error ? error.message : 'Client Secret 删除失败')
      return null
    } finally {
      deleteLoading.value = false
    }
  }

  const updateApp = (id: string) => {
    app.value = id
    void refresh()
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
