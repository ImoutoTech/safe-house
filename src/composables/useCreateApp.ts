import { regUserApp } from '@/api/app'
import type { UserAppRegParams } from '@/types'
import { useRequest } from 'alova'

const INIT_DATA = {
  name: '',
  callback: '',
  description: ''
}

export const useCreateApp = (callback?: () => void) => {
  const params = ref<UserAppRegParams>({ ...INIT_DATA })

  const msg = useMessage()

  const { send, loading, onSuccess } = useRequest((data: UserAppRegParams) => regUserApp(data), {
    immediate: false
  })

  const reset = () => {
    params.value = { ...INIT_DATA }
  }

  const submit = () => {
    send(params.value)
  }

  onSuccess(() => {
    msg.success('创建成功')
    callback?.()
  })

  return { params, loading, submit, reset }
}
