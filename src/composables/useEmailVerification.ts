import { createEmailChallenge, verifyEmailChallenge } from '@/api/user'
import type { EmailVerificationPurpose } from '@/types'
import { useRequest } from 'alova'

export const useEmailVerification = (purpose: EmailVerificationPurpose) => {
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
    const response = await sendChallenge(email)
    challengeId.value = response.data.challengeId
    proof.value = ''
    resendAt.value = new Date(response.data.resendAt).getTime()
    if (!timer) timer = setInterval(() => (now.value = Date.now()), 1000)
  }

  const verifyCode = async (code: string) => {
    if (!challengeId.value) throw new Error('请先发送验证码')
    const response = await sendCode(challengeId.value, code)
    proof.value = response.data.verificationProof
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
