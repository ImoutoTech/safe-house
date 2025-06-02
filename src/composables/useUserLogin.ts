import { userLogin } from '@/api/user'
import { useUserStore } from '@/stores/user'
import type { UserLoginParams } from '@/types'
import { useRequest } from 'alova'
import type { FormRules } from 'naive-ui'
import { Md5 } from 'ts-md5'
import { useCallbackStore } from '@/stores/callback'

const formRules: FormRules = {
  email: [{ required: true, message: '请输入邮箱' }],
  password: [{ required: true, message: '请输入密码' }]
}

export const useUserLogin = () => {
  const loginParam = reactive<UserLoginParams>({
    email: '',
    password: ''
  })

  const { updateToken } = useUserStore()
  const callbackStore = useCallbackStore()
  const msg = useMessage()
  const router = useRouter()

  const handleUpdateVal = (key: keyof UserLoginParams, val: string) => (loginParam[key] = val)

  const { send, loading, data, onSuccess, onError } = useRequest(
    (d: UserLoginParams) => userLogin(d),
    {
      immediate: false
    }
  )

  const submit = () => {
    const submitData = {
      ...loginParam,
      password: Md5.hashStr(loginParam.password)
    }

    send(submitData)
  }

  onSuccess(() => {
    updateToken(data.value.data.token, data.value.data.refresh)
    msg.success('登录成功')
    if (callbackStore.isCallback) {
      router.push({ name: 'callback-index', params: { id: callbackStore.app.id } })
    } else {
      router.push({ name: 'user-info' })
    }
  })

  onError((e) => {
    msg.error(e.error.message)
  })

  return { loading, data, formRules, loginParam: readonly(loginParam), handleUpdateVal, submit }
}
