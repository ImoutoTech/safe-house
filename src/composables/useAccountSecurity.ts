import { changeUserEmail, changeUserPassword } from '@/api/user'
import { useUserStore } from '@/stores/user'
import { useRequest } from 'alova'
import { Md5 } from 'ts-md5'
import { useEmailVerification } from './useEmailVerification'
import { useFeedback } from './useFeedback'

export const useChangeEmail = (onDone?: () => void) => {
  const userStore = useUserStore()
  const feedback = useFeedback()
  const email = ref('')
  const code = ref('')
  const verification = useEmailVerification('change_email')
  const { send, loading, onSuccess, onError } = useRequest(
    () =>
      changeUserEmail(userStore.userData.id, {
        email: email.value,
        verificationProof: verification.proof.value
      }),
    { immediate: false }
  )
  onSuccess((event) => {
    userStore.updateUserData(event.data.data)
    email.value = ''
    code.value = ''
    verification.reset()
    feedback.success('邮箱换绑成功')
    onDone?.()
  })
  onError((event) => feedback.error(event.error.message))
  watch(email, () => {
    code.value = ''
    verification.reset()
  })
  return { email, code, loading, verification, submit: send }
}

export const useChangePassword = (onDone?: () => void) => {
  const userStore = useUserStore()
  const feedback = useFeedback()
  const oldVal = ref('')
  const newVal = ref('')
  const code = ref('')
  const verification = useEmailVerification('change_password')
  const { send, loading, onSuccess, onError } = useRequest(
    () =>
      changeUserPassword(userStore.userData.id, {
        ...(userStore.userData.hasPassword ? { oldVal: Md5.hashStr(oldVal.value) } : {}),
        newVal: Md5.hashStr(newVal.value),
        verificationProof: verification.proof.value
      }),
    { immediate: false }
  )
  onSuccess((event) => {
    userStore.updateUserData(event.data.data)
    oldVal.value = ''
    newVal.value = ''
    code.value = ''
    verification.reset()
    feedback.success('密码更新成功')
    onDone?.()
  })
  onError((event) => feedback.error(event.error.message))
  return { oldVal, newVal, code, loading, verification, submit: send }
}
