<script setup lang="ts">
import { z } from 'zod'
import EmailVerificationInput from '@/components/email-verification-input.vue'
import UiButton from '@/components/ui/ui-button.vue'
import UiDialog from '@/components/ui/ui-dialog.vue'
import UiField from '@/components/ui/ui-field.vue'
import UiInput from '@/components/ui/ui-input.vue'
import { useChangePassword } from '@/composables/useAccountSecurity'
import { useUserStore } from '@/stores/user'

defineOptions({ name: 'ChangePasswordModal' })
const visible = defineModel('visible', { type: Boolean })
const { userData } = useUserStore()
const hasPassword = computed(() => userData.hasPassword)
const { oldVal, newVal, code, loading, verification, submit } = useChangePassword(
  () => (visible.value = false)
)
const { proof, secondsRemaining, sending, verifying, requestCode, verifyCode } = verification
const schema = computed(() =>
  z.object({
    oldVal: hasPassword.value ? z.string().min(1, '请输入原密码') : z.string(),
    newVal: z.string().min(1, '请输入新密码'),
    proof: z.string().min(1, '请先验证当前邮箱')
  })
)
const errors = shallowRef<Record<string, string>>({})
const handleVerify = async () => {
  if (await verifyCode(code.value)) errors.value = { ...errors.value, proof: '' }
}
const submitForm = () => {
  const result = schema.value.safeParse({
    oldVal: oldVal.value,
    newVal: newVal.value,
    proof: proof.value
  })
  if (!result.success) {
    errors.value = Object.fromEntries(
      result.error.issues.map((issue) => [String(issue.path[0]), issue.message])
    )
    return
  }
  errors.value = {}
  submit()
}
watch(visible, (shown) => {
  if (!shown) {
    oldVal.value = ''
    newVal.value = ''
    code.value = ''
    verification.reset()
    errors.value = {}
  }
})
</script>

<template>
  <UiDialog
    v-model:open="visible"
    :title="hasPassword ? '修改密码' : '设置密码'"
    description="通过当前邮箱验证后更新账号钥匙。"
    ><form class="grid gap-4" @submit.prevent="submitForm">
      <UiField v-if="hasPassword" label="原密码" for="old-password" :error="errors.oldVal"
        ><UiInput
          id="old-password"
          v-model="oldVal"
          type="password"
          autocomplete="current-password"
          :invalid="Boolean(errors.oldVal)"
          :aria-describedby="errors.oldVal ? 'old-password-error' : undefined" /></UiField
      ><UiField label="新密码" for="new-password" :error="errors.newVal"
        ><UiInput
          id="new-password"
          v-model="newVal"
          type="password"
          autocomplete="new-password"
          :invalid="Boolean(errors.newVal)"
          :aria-describedby="errors.newVal ? 'new-password-error' : undefined" /></UiField
      ><UiField label="当前邮箱验证" for="change-password-verification-code" :error="errors.proof"
        ><template #default="field"
          ><EmailVerificationInput
            id="change-password-verification-code"
            v-model:code="code"
            :seconds-remaining="secondsRemaining"
            :sending="sending"
            :verifying="verifying"
            :verified="Boolean(proof)"
            :invalid="field.invalid"
            :described-by="field.describedBy"
            @send="requestCode()"
            @verify="handleVerify" /></template></UiField
      ><UiButton type="submit" block :loading="loading" :disabled="!proof">确认</UiButton>
    </form></UiDialog
  >
</template>
