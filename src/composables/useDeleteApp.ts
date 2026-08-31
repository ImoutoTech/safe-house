import { delUserApp } from '@/api/app'
import type { AppInfo } from '@/types'
import { useRequest } from 'alova'
import { useFeedback } from './useFeedback'

export const useDeleteApp = (app: AppInfo, callback?: () => void) => {
  const feedback = useFeedback()

  const { send, loading } = useRequest(delUserApp(app.id), {
    immediate: false
  })

  const submit = async () => {
    try {
      await send()
      feedback.success('删除成功')
      callback?.()
    } catch (error) {
      feedback.error(error instanceof Error ? error.message : '删除失败')
      return false
    }
    return true
  }

  return { submit, loading }
}
