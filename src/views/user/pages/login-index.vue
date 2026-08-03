<script setup lang="ts">
import FlexCenterLayout from '@/layout/FlexCenterLayout.vue'
import { useUserLogin } from '@/composables/useUserLogin'
import { normalizeLocalReturnTo, useExternalLogin } from '@/composables/useExternalLogin'
import type { FormInst } from 'naive-ui'

defineOptions({ name: 'LoginIndex' })

const { loginParam, formRules, loading, handleUpdateVal, submit } = useUserLogin()
const { providers, loading: externalLoading, error: providerError, start } = useExternalLogin()
const formRef = ref<FormInst>()
const router = useRouter()
const route = useRoute()
const returnTo = computed(() => normalizeLocalReturnTo(route.query.return_to))

const handleConfirm = () => {
  formRef.value?.validate((errors) => {
    if (!errors) submit()
  })
}
</script>

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
        <n-divider v-if="providers.length">其他登录方式</n-divider>
        <n-alert v-if="providerError" type="warning" title="外部登录暂不可用" />
        <n-flex v-else vertical>
          <n-button
            v-for="provider in providers"
            :key="provider.provider"
            :loading="externalLoading"
            @click="start(provider.provider, returnTo)"
          >
            使用 {{ provider.provider === 'github' ? 'GitHub' : 'Google' }} 登录
          </n-button>
        </n-flex>
      </n-flex>
    </main>
  </flex-center-layout>
</template>
<style lang="scss" scoped>
.login-container {
  width: 300px;
}
</style>
