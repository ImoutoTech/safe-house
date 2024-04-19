import { delUserApp } from '@/api/app'
import type { AppInfo } from '@/types'
import { useRequest } from 'alova'

export const useDeleteApp = (app: AppInfo, callback?: () => void) => {
  const msg = useMessage()
  const dialog = useDialog()

  const { send } = useRequest(delUserApp(app.id), {
    immediate: false
  })

  const submit = () => {
    const d = dialog.warning({
      title: '子应用删除',
      content: `确定要删除「${app.name}」吗？`,
      positiveText: '确认',
      negativeText: '取消',
      onPositiveClick: () => {
        d.loading = true
        return new Promise((rs) => {
          send()
            .then(() => {
              msg.success('删除成功')
              callback?.()
            })
            .catch((e) => {
              msg.error(e.message)
            })
            .then(rs)
        })
      }
    })
  }

  return { submit }
}
