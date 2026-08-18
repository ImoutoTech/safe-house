<script setup lang="ts">
import FlexCenterLayout from '@/layout/FlexCenterLayout.vue'
import { useUserLogin } from '@/composables/useUserLogin'
import { normalizeLocalReturnTo, useExternalLogin } from '@/composables/useExternalLogin'
import type { FormInst } from 'naive-ui'
import { LogoGithub, LogoGoogle } from '@vicons/ionicons5'
import { peekAuthorizationContinuation } from '@/utils/authorizationContinuation'

defineOptions({ name: 'LoginIndex' })

const { loginParam, formRules, loading, handleUpdateVal, submit } = useUserLogin()
const {
  providers,
  activeProvider,
  loading: externalLoading,
  error: providerError,
  start
} = useExternalLogin()
const formRef = ref<FormInst>()
const router = useRouter()
const route = useRoute()
const returnTo = computed(() =>
  normalizeLocalReturnTo(route.query.return_to, peekAuthorizationContinuation() ?? '/user')
)
const providerLabel = (provider: string) => (provider === 'github' ? 'GitHub' : 'Google')
const providerIcon = (provider: string) => (provider === 'github' ? LogoGithub : LogoGoogle)

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
        <n-alert v-if="providerError" type="warning" title="外部登录暂不可用" />
        <n-flex v-else-if="providers.length" class="external-login-actions" vertical>
          <n-button
            v-for="provider in providers"
            :key="provider.provider"
            block
            secondary
            class="external-login-button"
            :disabled="externalLoading && activeProvider !== provider.provider"
            :loading="activeProvider === provider.provider"
            @click="start(provider.provider, returnTo)"
          >
            <template #icon>
              <n-icon
                :color="provider.provider === 'google' ? '#4285f4' : undefined"
                :component="providerIcon(provider.provider)"
              />
            </template>
            使用 {{ providerLabel(provider.provider) }} 登录
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

.external-login-actions {
  margin-top: 8px;
}

.external-login-button {
  width: 100%;
}
</style>
