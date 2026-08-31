<script setup lang="ts">
import { z } from 'zod'
import EmailVerificationInput from '@/components/email-verification-input.vue'
import UiButton from '@/components/ui/ui-button.vue'
import UiDialog from '@/components/ui/ui-dialog.vue'
import UiField from '@/components/ui/ui-field.vue'
import UiInput from '@/components/ui/ui-input.vue'
import { useChangeEmail } from '@/composables/useAccountSecurity'
import { useFormValidation } from '@/composables/useFormValidation'

defineOptions({ name: 'ChangeEmailModal' })
const visible = defineModel('visible', { type: Boolean })
const { email, code, loading, verification, submit } = useChangeEmail(() => (visible.value = false))
const { proof, secondsRemaining, sending, verifying, requestCode, verifyCode } = verification
const schema = z.object({
  email: z.string().trim().email('请输入有效邮箱'),
  proof: z.string().min(1, '请先验证新邮箱')
})
const { errors, validate, clear } = useFormValidation(schema)
const handleVerify = async () => {
  if (await verifyCode(code.value)) clear('proof')
}
const submitForm = () => {
  if (validate({ email: email.value, proof: proof.value })) submit()
}
watch(visible, (shown) => {
  if (!shown) {
    email.value = ''
    code.value = ''
    verification.reset()
    clear()
  }
})
</script>

<template>
  <UiDialog v-model:open="visible" title="更换邮箱" description="新邮箱验证通过后才会完成换绑。"
    ><form class="grid gap-4" @submit.prevent="submitForm">
      <UiField label="新邮箱" for="change-email" :error="errors.email"
        ><template #default="field"
          ><UiInput
            id="change-email"
            v-model="email"
            type="email"
            autocomplete="email"
            :invalid="field.invalid"
            :aria-describedby="field.describedBy"
            @update:model-value="clear('email')" /></template></UiField
      ><UiField label="邮箱验证" for="change-email-verification-code" :error="errors.proof"
        ><template #default="field"
          ><EmailVerificationInput
            id="change-email-verification-code"
            v-model:code="code"
            :seconds-remaining="secondsRemaining"
            :sending="sending"
            :verifying="verifying"
            :verified="Boolean(proof)"
            :disabled="!email"
            :invalid="field.invalid"
            :described-by="field.describedBy"
            @send="requestCode(email)"
            @verify="handleVerify" /></template></UiField
      ><UiButton type="submit" block :loading="loading" :disabled="!proof">确认换绑</UiButton>
    </form></UiDialog
  >
</template>
