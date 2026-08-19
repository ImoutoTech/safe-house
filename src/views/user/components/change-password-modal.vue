<template>
  <n-modal v-model:show="visible">
    <n-card
      class="common-dialog"
      :title="hasPassword ? '修改密码' : '设置密码'"
      :bordered="false"
      role="dialog"
      aria-modal="true"
    >
      <n-form ref="formRef" :model="form" :rules="rules">
        <n-form-item v-if="hasPassword" label="原密码" path="oldVal">
          <n-input v-model:value="oldVal" type="password" autocomplete="current-password" />
        </n-form-item>
        <n-form-item label="新密码" path="newVal">
          <n-input v-model:value="newVal" type="password" autocomplete="new-password" />
        </n-form-item>
        <n-form-item label="当前邮箱验证">
          <email-verification-input
            v-model:code="code"
            :seconds-remaining="secondsRemaining"
            :sending="sending"
            :verifying="verifying"
            :verified="Boolean(proof)"
            @send="requestCode()"
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
        确认
      </n-button>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import EmailVerificationInput from '@/components/email-verification-input.vue'
import { useChangePassword } from '@/composables/useAccountSecurity'
import { useUserStore } from '@/stores/user'
import type { FormInst, FormRules } from 'naive-ui'

defineOptions({ name: 'ChangePasswordModal' })
const visible = defineModel('visible', { type: Boolean })
const formRef = ref<FormInst>()
const { userData } = useUserStore()
const hasPassword = computed(() => userData.hasPassword)
const { oldVal, newVal, code, loading, verification, submit } = useChangePassword(
  () => (visible.value = false)
)
const { proof, secondsRemaining, sending, verifying, requestCode, verifyCode } = verification
const form = computed(() => ({ oldVal: oldVal.value, newVal: newVal.value }))
const rules = computed<FormRules>(() => ({
  ...(hasPassword.value ? { oldVal: [{ required: true, message: '请输入原密码' }] } : {}),
  newVal: [{ required: true, message: '请输入新密码' }]
}))
const submitForm = () => formRef.value?.validate((errors) => !errors && submit())
watch(visible, (shown) => {
  if (shown) return
  oldVal.value = ''
  newVal.value = ''
  code.value = ''
  verification.reset()
})
</script>
