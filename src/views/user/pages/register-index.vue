<template>
  <flex-center-layout>
    <main class="reg-container" @keypress.enter="handleConfirm">
      <n-flex vertical>
        <n-form ref="formRef" :model="regParam" :rules="formRules">
          <n-form-item path="email" label="📮 邮箱">
            <n-input
              :value="regParam.email"
              :disabled="loading"
              placeholder="i@example.com"
              @input="handleUpdateVal('email', $event)"
            />
          </n-form-item>
          <n-form-item label="✉️ 邮箱验证">
            <email-verification-input
              v-model:code="code"
              :seconds-remaining="secondsRemaining"
              :sending="sendingCode"
              :verifying="verifyingCode"
              :verified="Boolean(regParam.verificationProof)"
              :disabled="loading || !regParam.email"
              @send="requestCode"
              @verify="verifyCode"
            />
          </n-form-item>
          <n-form-item path="nickname" label="🌏 用户名">
            <n-input
              :value="regParam.nickname"
              :disabled="loading"
              placeholder="username"
              @input="handleUpdateVal('nickname', $event)"
            />
          </n-form-item>
          <n-form-item path="password" label="🔐 钥匙">
            <n-input
              :value="regParam.password"
              :disabled="loading"
              type="password"
              placeholder="***"
              @input="handleUpdateVal('password', $event)"
            />
          </n-form-item>
        </n-form>

        <n-flex justify="space-between">
          <n-button text type="info" :disabled="loading" @click="router.push({ name: 'login' })">
            我有钥匙
          </n-button>
          <n-button
            secondary
            type="primary"
            :disabled="!regParam.verificationProof"
            :loading="loading"
            @click="handleConfirm"
          >
            加入
          </n-button>
        </n-flex>
      </n-flex>
    </main>
  </flex-center-layout>
</template>
<script setup lang="ts">
import FlexCenterLayout from '@/layout/FlexCenterLayout.vue'
import type { FormInst } from 'naive-ui'
import { useUserRegister } from '@/composables/useUserRegister'
import EmailVerificationInput from '@/components/email-verification-input.vue'

defineOptions({
  name: 'RegisterIndex'
})

const {
  regParam,
  formRules,
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
const formRef = ref<FormInst>()
const router = useRouter()

const handleConfirm = () => {
  formRef.value?.validate((errors) => {
    if (errors) return

    submit()
  })
}
</script>
<style lang="scss" scoped>
.reg-container {
  width: min(300px, calc(100vw - 32px));
}
</style>
