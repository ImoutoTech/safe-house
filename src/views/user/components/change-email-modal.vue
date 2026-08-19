<template>
  <n-modal v-model:show="visible">
    <n-card
      class="common-dialog"
      title="更换邮箱"
      :bordered="false"
      role="dialog"
      aria-modal="true"
    >
      <n-form ref="formRef" :model="form" :rules="rules">
        <n-form-item label="新邮箱" path="email">
          <n-input v-model:value="email" autocomplete="email" />
        </n-form-item>
        <n-form-item label="邮箱验证">
          <email-verification-input
            v-model:code="code"
            :seconds-remaining="secondsRemaining"
            :sending="sending"
            :verifying="verifying"
            :verified="Boolean(proof)"
            :disabled="!email"
            @send="requestCode(email)"
            @verify="verifyCode(code)"
          />
        </n-form-item>
      </n-form>
      <n-button
        block
        secondary
        type="primary"
        :loading="loading"
        :disabled="!proof"
        @click="submitForm"
      >
        确认换绑
      </n-button>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import EmailVerificationInput from '@/components/email-verification-input.vue'
import { useChangeEmail } from '@/composables/useAccountSecurity'
import type { FormInst, FormRules } from 'naive-ui'

defineOptions({ name: 'ChangeEmailModal' })
const visible = defineModel('visible', { type: Boolean })
const formRef = ref<FormInst>()
const { email, code, loading, verification, submit } = useChangeEmail(() => (visible.value = false))
const { proof, secondsRemaining, sending, verifying, requestCode, verifyCode } = verification
const form = computed(() => ({ email: email.value }))
const rules: FormRules = { email: [{ required: true, type: 'email', message: '请输入有效邮箱' }] }
const submitForm = () => formRef.value?.validate((errors) => !errors && submit())
watch(visible, (shown) => {
  if (shown) return
  email.value = ''
  code.value = ''
  verification.reset()
})
</script>
