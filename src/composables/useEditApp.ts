import { updateUserApp } from '@/api/app'
import type { AppInfo, UserAppRegParams } from '@/types'
import { useRequest } from 'alova'

export const useEditApp = (callback?: () => void) => {
  const origin = ref<AppInfo>()

  const params = ref<UserAppRegParams>({
    name: '',
    callback: '',
    description: ''
  })

  const msg = useMessage()

  const { send, loading, onSuccess } = useRequest(
    (data: UserAppRegParams) => updateUserApp(origin.value?.id || '', data),
    {
      immediate: false
    }
  )

  const setApp = (app: AppInfo) => {
    params.value = {
      name: app.name,
      callback: app.callback,
      description: app.description
    }

    origin.value = { ...app }
  }

  const submit = () => {
    send(params.value)
  }

  onSuccess(() => {
    msg.success('编辑成功')
    callback?.()
  })

  return { params, loading, submit, setApp }
}
