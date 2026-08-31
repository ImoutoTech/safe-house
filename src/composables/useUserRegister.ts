import { userRegister } from '@/api/user'
import type { UserRegisterParams } from '@/types'
import { useRequest } from 'alova'
import { Md5 } from 'ts-md5'
import { useEmailVerification } from './useEmailVerification'
import { useFeedback } from './useFeedback'

export const useUserRegister = () => {
  const regParam = reactive<UserRegisterParams>({
    email: '',
    password: '',
    nickname: '',
    verificationProof: ''
  })
  const code = ref('')
  const verification = useEmailVerification('register')

  const feedback = useFeedback()
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
    const sent = await verification.requestCode(regParam.email)
    if (sent) feedback.success('验证码已发送')
    return sent
  }

  const verifyCode = async () => {
    const verified = await verification.verifyCode(code.value)
    if (!verified) return false
    regParam.verificationProof = verification.proof.value
    feedback.success('邮箱验证成功')
    return true
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
    feedback.success('注册成功')
    router.push({ name: 'login' })
  })

  onError((e) => {
    feedback.error(e.error.message)
  })

  return {
    loading,
    data,
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
