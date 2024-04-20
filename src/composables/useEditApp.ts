import { updateUserApp } from '@/api/app'
import { AppStatus, type AppInfo, type UserAppUpdateParams } from '@/types'
import { useRequest } from 'alova'

export const useEditApp = (callback?: () => void) => {
  const origin = ref<AppInfo>()

  const params = ref<UserAppUpdateParams>({
    name: '',
    callback: '',
    description: '',
    status: AppStatus.RUNNING
  })

  const msg = useMessage()

  const { send, loading, onSuccess } = useRequest(
    (data: UserAppUpdateParams) => updateUserApp(origin.value?.id || '', data),
    {
      immediate: false
    }
  )

  const setApp = (app: AppInfo) => {
    params.value = {
      name: app.name,
      callback: app.callback,
      description: app.description,
      status: app.meta.status
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
