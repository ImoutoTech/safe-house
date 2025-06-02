<template>
  <flex-center-layout>
    <main class="login-container" @keypress.enter="handleConfirm">
      <n-flex vertical>
        <n-form ref="formRef" :model="loginParam" :rules="formRules">
          <n-form-item path="email" label="📮 邮箱">
            <n-input
              :value="loginParam.email"
              :disabled="loading"
              placeholder="i@example.com"
              @input="handleUpdateVal('email', $event)"
            />
          </n-form-item>
          <n-form-item path="password" label="🔐 钥匙">
            <n-input
              :value="loginParam.password"
              :disabled="loading"
              type="password"
              placeholder="***"
              @input="handleUpdateVal('password', $event)"
            />
          </n-form-item>
        </n-form>

        <n-flex justify="space-between">
          <n-button text type="info" :disabled="loading" @click="router.push({ name: 'register' })">
            加入
          </n-button>
          <n-button secondary type="primary" :loading="loading" @click="handleConfirm">
            开门
          </n-button>
        </n-flex>
      </n-flex>
    </main>
  </flex-center-layout>
</template>
<script setup lang="ts">
import FlexCenterLayout from '@/layout/FlexCenterLayout.vue'
import { useUserLogin } from '@/composables/useUserLogin'
import type { FormInst } from 'naive-ui'

defineOptions({
  name: 'LoginIndex'
})

const { loginParam, formRules, loading, handleUpdateVal, submit } = useUserLogin()
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
.login-container {
  width: 300px;
}
</style>
