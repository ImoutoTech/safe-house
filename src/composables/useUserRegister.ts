import { userRegister } from '@/api/user'
import type { UserRegisterParams } from '@/types'
import { useRequest } from 'alova'
import type { FormRules } from 'naive-ui'
import { Md5 } from 'ts-md5'

const formRules: FormRules = {
  email: [{ required: true, message: '请输入邮箱' }],
  password: [{ required: true, message: '请输入密码' }],
  nickname: [{ required: true, message: '请输入用户名' }]
}

export const useUserRegister = () => {
  const regParam = reactive<UserRegisterParams>({
    email: '',
    password: '',
    nickname: ''
  })

  const msg = useMessage()
  const router = useRouter()

  const handleUpdateVal = (key: keyof UserRegisterParams, val: string) => (regParam[key] = val)

  const { send, loading, data, onSuccess, onError } = useRequest(
    (d: UserRegisterParams) => userRegister(d),
    {
      immediate: false
    }
  )

  const submit = () => {
    const submitData = {
      ...regParam,
      password: Md5.hashStr(regParam.password)
    }

    send(submitData)
  }

  onSuccess(() => {
    msg.success('注册成功')
    router.push({ name: 'login' })
  })

  onError((e) => {
    msg.error(e.error.message)
  })

  return { loading, data, formRules, regParam: readonly(regParam), handleUpdateVal, submit }
}
