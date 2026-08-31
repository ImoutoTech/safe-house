<script setup lang="ts">
import { Chrome, Github } from 'lucide-vue-next'
import { z } from 'zod'
import AuthPanel from '@/components/patterns/auth-panel.vue'
import UiAlert from '@/components/ui/ui-alert.vue'
import UiButton from '@/components/ui/ui-button.vue'
import UiField from '@/components/ui/ui-field.vue'
import UiInput from '@/components/ui/ui-input.vue'
import { useExternalLogin } from '@/composables/useExternalLogin'
import { useFormValidation } from '@/composables/useFormValidation'
import { useUserLogin } from '@/composables/useUserLogin'
import FlexCenterLayout from '@/layout/FlexCenterLayout.vue'

defineOptions({ name: 'LoginIndex' })
const { loginParam, loading, handleUpdateVal, submit } = useUserLogin()
const {
  providers,
  activeProvider,
  loading: externalLoading,
  error: providerError,
  start
} = useExternalLogin()
const router = useRouter()
const schema = z.object({
  email: z.string().trim().min(1, '请输入邮箱').email('请输入有效邮箱'),
  password: z.string().min(1, '请输入密码')
})
const { errors, validate, clear } = useFormValidation(schema)
const providerLabel = (provider: string) => (provider === 'github' ? 'GitHub' : 'Google')
const providerIcon = (provider: string) => (provider === 'github' ? Github : Chrome)
const updateLoginField = (
  field: 'email' | 'password',
  value: string | number | null | undefined
) => {
  handleUpdateVal(field, String(value ?? ''))
  clear(field)
}
const handleConfirm = () => {
  if (validate({ ...loginParam })) submit()
}
</script>

<template>
  <FlexCenterLayout>
    <AuthPanel title="欢迎回来" description="拿出你的钥匙，继续进入 Safe House。">
      <form class="grid gap-4" novalidate @submit.prevent="handleConfirm">
        <UiField label="邮箱" for="login-email" :error="errors.email"
          ><template #default="field"
            ><UiInput
              id="login-email"
              :model-value="loginParam.email"
              type="email"
              autocomplete="email"
              placeholder="i@example.com"
              :disabled="loading"
              :invalid="field.invalid"
              :aria-describedby="field.describedBy"
              @update:model-value="updateLoginField('email', $event)" /></template
        ></UiField>
        <UiField label="钥匙" for="login-password" :error="errors.password"
          ><template #default="field"
            ><UiInput
              id="login-password"
              :model-value="loginParam.password"
              type="password"
              autocomplete="current-password"
              placeholder="输入密码"
              :disabled="loading"
              :invalid="field.invalid"
              :aria-describedby="field.describedBy"
              @update:model-value="updateLoginField('password', $event)" /></template
        ></UiField>
        <UiButton type="submit" block :loading="loading">开门</UiButton>
        <UiButton
          type="button"
          variant="link"
          block
          :disabled="loading"
          @click="router.push({ name: 'register' })"
          >还没有钥匙？加入 Safe House</UiButton
        >
      </form>
      <div v-if="providerError || providers.length" class="mt-5 grid gap-3">
        <div
          class="flex items-center gap-3 text-xs text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border"
        >
          或使用外部身份
        </div>
        <UiAlert v-if="providerError" variant="warning" title="外部登录暂不可用"
          >你仍可以使用邮箱和密码登录。</UiAlert
        >
        <UiButton
          v-for="provider in providers"
          v-else
          :key="provider.provider"
          type="button"
          variant="outline"
          block
          :disabled="externalLoading && activeProvider !== provider.provider"
          :loading="activeProvider === provider.provider"
          @click="start(provider.provider)"
          ><component :is="providerIcon(provider.provider)" aria-hidden="true" />使用
          {{ providerLabel(provider.provider) }} 登录</UiButton
        >
      </div>
    </AuthPanel>
  </FlexCenterLayout>
</template>
