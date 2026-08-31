import { createEmailChallenge, verifyEmailChallenge } from '@/api/user'
import type { EmailVerificationPurpose } from '@/types'
import { useRequest } from 'alova'
import { useFeedback } from './useFeedback'

export const useEmailVerification = (purpose: EmailVerificationPurpose) => {
  const feedback = useFeedback()
  const challengeId = ref('')
  const proof = ref('')
  const resendAt = ref(0)
  const now = ref(Date.now())
  let timer: ReturnType<typeof setInterval> | undefined

  const { send: sendChallenge, loading: sending } = useRequest(
    (email?: string) => createEmailChallenge({ purpose, ...(email ? { email } : {}) }),
    { immediate: false }
  )
  const { send: sendCode, loading: verifying } = useRequest(
    (id: string, code: string) => verifyEmailChallenge(id, code),
    { immediate: false }
  )

  const secondsRemaining = computed(() =>
    Math.max(0, Math.ceil((resendAt.value - now.value) / 1000))
  )

  const requestCode = async (email?: string) => {
    try {
      const response = await sendChallenge(email)
      challengeId.value = response.data.challengeId
      proof.value = ''
      resendAt.value = new Date(response.data.resendAt).getTime()
      if (!timer) timer = setInterval(() => (now.value = Date.now()), 1000)
      return true
    } catch (error) {
      feedback.error(error instanceof Error ? error.message : '验证码发送失败')
      return false
    }
  }

  const verifyCode = async (code: string) => {
    if (!challengeId.value) {
      feedback.warning('请先发送验证码')
      return false
    }
    try {
      const response = await sendCode(challengeId.value, code)
      proof.value = response.data.verificationProof
      return true
    } catch (error) {
      feedback.error(error instanceof Error ? error.message : '邮箱验证失败')
      return false
    }
  }

  const reset = () => {
    challengeId.value = ''
    proof.value = ''
    resendAt.value = 0
  }

  onScopeDispose(() => timer && clearInterval(timer))

  return {
    challengeId: readonly(challengeId),
    proof: readonly(proof),
    sending,
    verifying,
    secondsRemaining,
    requestCode,
    verifyCode,
    reset
  }
}
