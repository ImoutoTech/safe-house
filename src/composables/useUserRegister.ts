import { userRegister } from '@/api/user'
import type { UserRegisterParams } from '@/types'
import { useRequest } from 'alova'
import type { FormRules } from 'naive-ui'
import { Md5 } from 'ts-md5'
import { useEmailVerification } from './useEmailVerification'

const formRules: FormRules = {
  email: [{ required: true, message: '请输入邮箱' }],
  password: [{ required: true, message: '请输入密码' }],
  nickname: [{ required: true, message: '请输入用户名' }]
}

export const useUserRegister = () => {
  const regParam = reactive<UserRegisterParams>({
    email: '',
    password: '',
    nickname: '',
    verificationProof: ''
  })
  const code = ref('')
  const verification = useEmailVerification('register')

  const msg = useMessage()
  const router = useRouter()

  const handleUpdateVal = (key: keyof UserRegisterParams, val: string) => {
    regParam[key] = val
    if (key === 'email') {
      code.value = ''
      regParam.verificationProof = ''
      verification.reset()
    }
  }

  const requestCode = async () => {
    await verification.requestCode(regParam.email)
    msg.success('验证码已发送')
  }

  const verifyCode = async () => {
    await verification.verifyCode(code.value)
    regParam.verificationProof = verification.proof.value
    msg.success('邮箱验证成功')
  }

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

  return {
    loading,
    data,
    formRules,
    regParam: readonly(regParam),
    code,
    sendingCode: verification.sending,
    verifyingCode: verification.verifying,
    secondsRemaining: verification.secondsRemaining,
    handleUpdateVal,
    requestCode,
    verifyCode,
    submit
  }
}
