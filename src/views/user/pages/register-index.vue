<script setup lang="ts">
import { z } from 'zod'
import AuthPanel from '@/components/patterns/auth-panel.vue'
import EmailVerificationInput from '@/components/email-verification-input.vue'
import UiButton from '@/components/ui/ui-button.vue'
import UiField from '@/components/ui/ui-field.vue'
import UiInput from '@/components/ui/ui-input.vue'
import { useFormValidation } from '@/composables/useFormValidation'
import { useUserRegister } from '@/composables/useUserRegister'
import FlexCenterLayout from '@/layout/FlexCenterLayout.vue'
import type { UserRegisterParams } from '@/types'

defineOptions({ name: 'RegisterIndex' })
const {
  regParam,
  loading,
  code,
  sendingCode,
  verifyingCode,
  secondsRemaining,
  handleUpdateVal,
  requestCode,
  verifyCode,
  submit
} = useUserRegister()
const router = useRouter()
const schema = z.object({
  email: z.string().trim().email('请输入有效邮箱'),
  nickname: z.string().trim().min(1, '请输入用户名'),
  password: z.string().min(1, '请输入密码'),
  verificationProof: z.string().min(1, '请先完成邮箱验证')
})
const { errors, validate, clear } = useFormValidation<UserRegisterParams>(schema)
const updateRegisterField = (
  field: 'email' | 'nickname' | 'password',
  value: string | number | null | undefined
) => {
  handleUpdateVal(field, String(value ?? ''))
  clear(field)
}
const handleVerify = async () => {
  if (await verifyCode()) clear('verificationProof')
}
const handleConfirm = () => {
  if (validate({ ...regParam })) submit()
}
</script>

<template>
  <FlexCenterLayout>
    <AuthPanel title="加入 Safe House" description="验证邮箱并为你的新身份准备一把钥匙。">
      <form class="grid gap-4" novalidate @submit.prevent="handleConfirm">
        <UiField label="邮箱" for="register-email" :error="errors.email"
          ><template #default="field"
            ><UiInput
              id="register-email"
              :model-value="regParam.email"
              type="email"
              autocomplete="email"
              placeholder="i@example.com"
              :disabled="loading"
              :invalid="field.invalid"
              :aria-describedby="field.describedBy"
              @update:model-value="updateRegisterField('email', $event)" /></template
        ></UiField>
        <UiField label="邮箱验证" for="register-verification-code" :error="errors.verificationProof"
          ><template #default="field"
            ><EmailVerificationInput
              id="register-verification-code"
              v-model:code="code"
              :seconds-remaining="secondsRemaining"
              :sending="sendingCode"
              :verifying="verifyingCode"
              :verified="Boolean(regParam.verificationProof)"
              :disabled="loading || !regParam.email"
              :invalid="field.invalid"
              :described-by="field.describedBy"
              @send="requestCode"
              @verify="handleVerify" /></template
        ></UiField>
        <UiField label="用户名" for="register-nickname" :error="errors.nickname"
          ><template #default="field"
            ><UiInput
              id="register-nickname"
              :model-value="regParam.nickname"
              autocomplete="nickname"
              placeholder="username"
              :disabled="loading"
              :invalid="field.invalid"
              :aria-describedby="field.describedBy"
              @update:model-value="updateRegisterField('nickname', $event)" /></template
        ></UiField>
        <UiField label="钥匙" for="register-password" :error="errors.password"
          ><template #default="field"
            ><UiInput
              id="register-password"
              :model-value="regParam.password"
              type="password"
              autocomplete="new-password"
              placeholder="设置密码"
              :disabled="loading"
              :invalid="field.invalid"
              :aria-describedby="field.describedBy"
              @update:model-value="updateRegisterField('password', $event)" /></template
        ></UiField>
        <UiButton type="submit" block :loading="loading" :disabled="!regParam.verificationProof"
          >加入</UiButton
        >
        <UiButton
          type="button"
          variant="link"
          block
          :disabled="loading"
          @click="router.push({ name: 'login' })"
          >我已经有钥匙</UiButton
        >
      </form>
    </AuthPanel>
  </FlexCenterLayout>
</template>
