import {
  createNotificationApiKey,
  deleteNotificationApiKey,
  getNotificationApiKeys,
  setNotificationApiKeyEnabled
} from '@/api/notification'
import type { NotificationApiKey } from '@/types'
import { useRequest } from 'alova'

export const useNotificationKeys = () => {
  const appId = shallowRef('')
  const keys = shallowRef<NotificationApiKey[]>([])
  const listError = shallowRef<Error>()
  const message = useMessage()

  const listRequest = useRequest((id: string) => getNotificationApiKeys(id), { immediate: false })
  const createRequest = useRequest(() => createNotificationApiKey(appId.value), {
    immediate: false
  })
  const toggleRequest = useRequest(
    ({ keyId, enabled }: { keyId: string; enabled: boolean }) =>
      setNotificationApiKeyEnabled(appId.value, keyId, enabled),
    { immediate: false }
  )
  const deleteRequest = useRequest(
    (keyId: string) => deleteNotificationApiKey(appId.value, keyId),
    { immediate: false }
  )

  const reportError = (error: unknown, fallback: string) => {
    message.error(error instanceof Error ? error.message : fallback)
  }

  const refresh = async () => {
    if (!appId.value) return
    const requestedAppId = appId.value
    listError.value = undefined
    try {
      const response = await listRequest.send(requestedAppId)
      if (appId.value === requestedAppId) keys.value = response.data
    } catch (error) {
      if (appId.value === requestedAppId) {
        listError.value = error instanceof Error ? error : new Error('通知 API Key 加载失败')
      }
      reportError(error, '通知 API Key 加载失败')
    }
  }

  const updateApp = async (id: string) => {
    if (appId.value !== id) keys.value = []
    appId.value = id
    await refresh()
  }

  const create = async () => {
    try {
      const response = await createRequest.send()
      const value = response.data.value
      // The create projection is the only response containing plaintext. Do not
      // leave it retained in Alova request state after handing it to the dialog.
      createRequest.data.value = {
        ...response,
        data: { ...response.data, value: '' }
      }
      await refresh()
      message.success('通知 API Key 已创建')
      return value
    } catch (error) {
      reportError(error, '通知 API Key 创建失败')
      return null
    }
  }

  const toggle = async (keyId: string, enabled: boolean) => {
    try {
      await toggleRequest.send({ keyId, enabled })
      await refresh()
    } catch (error) {
      reportError(error, '通知 API Key 状态更新失败')
    }
  }

  const remove = async (keyId: string) => {
    try {
      await deleteRequest.send(keyId)
      await refresh()
      message.success('通知 API Key 已吊销')
    } catch (error) {
      reportError(error, '通知 API Key 吊销失败')
    }
  }

  return {
    keys: readonly(keys),
    loading: computed(
      () =>
        listRequest.loading.value ||
        createRequest.loading.value ||
        toggleRequest.loading.value ||
        deleteRequest.loading.value
    ),
    createLoading: readonly(createRequest.loading),
    error: readonly(listError),
    updateApp,
    refresh,
    create,
    toggle,
    remove
  }
}
