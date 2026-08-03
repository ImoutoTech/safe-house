import { userLogin } from '@/api/user'
import { useUserStore } from '@/stores/user'
import type { UserLoginParams } from '@/types'
import { useRequest } from 'alova'
import type { FormRules } from 'naive-ui'
import { Md5 } from 'ts-md5'
import { useCallbackStore } from '@/stores/callback'
import { useBindingTransaction } from './useBindingTransaction'
import { bindExternalIdentity } from '@/api/oauth'
import { normalizeLocalReturnTo } from './useExternalLogin'

const formRules: FormRules = {
  email: [{ required: true, message: '请输入邮箱' }],
  password: [{ required: true, message: '请输入密码' }]
}

export const useUserLogin = () => {
  const loginParam = reactive<UserLoginParams>({
    email: '',
    password: ''
  })

  const { updateToken, updateUserData } = useUserStore()
  const callbackStore = useCallbackStore()
  const msg = useMessage()
  const router = useRouter()
  const route = useRoute()
  const { consumeBindingToken } = useBindingTransaction()

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

  onSuccess(async () => {
    updateToken(data.value.data.token, data.value.data.refresh)
    const bindingToken = consumeBindingToken()
    if (bindingToken) {
      try {
        const result = await bindExternalIdentity(bindingToken)
        updateToken(result.data.token, result.data.refresh)
        updateUserData(result.data.user)
        msg.success('登录并绑定成功')
        await router.push({ name: 'user-identities' })
        return
      } catch (error) {
        msg.error(error instanceof Error ? error.message : '身份绑定失败')
        await router.push({ name: 'user-identities' })
        return
      }
    }
    msg.success('登录成功')
    if (callbackStore.isCallback) {
      router.push({ name: 'callback-index', params: { id: callbackStore.app.id } })
    } else if (route.query.return_to) {
      router.push(normalizeLocalReturnTo(route.query.return_to))
    } else {
      router.push({ name: 'user-info' })
    }
  })

  onError((e) => {
    msg.error(e.error.message)
  })

  return { loading, data, formRules, loginParam: readonly(loginParam), handleUpdateVal, submit }
}
