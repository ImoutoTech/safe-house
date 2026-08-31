<script setup lang="ts">
import { CircleCheck, CircleX, LoaderCircle, TriangleAlert } from 'lucide-vue-next'
import UiButton from '@/components/ui/ui-button.vue'
import UiCard from '@/components/ui/ui-card.vue'
import { useBindingTransaction } from '@/composables/useBindingTransaction'
import { useExternalCallback } from '@/composables/useExternalLogin'
import { useUserStore } from '@/stores/user'
import { consumeAuthorizationContinuation } from '@/utils/authorizationContinuation'

defineOptions({ name: 'ExternalCallbackView' })
const route = useRoute()
const router = useRouter()
const resultId = typeof route.query.result === 'string' ? route.query.result : ''
const status = shallowRef<
  'loading' | 'authenticated' | 'bound' | 'unbound' | 'binding' | 'email' | 'error'
>('loading')
const description = shallowRef('正在完成外部登录…')
const { finish } = useExternalCallback()
const { setBindingToken, clearBindingToken } = useBindingTransaction()
const userStore = useUserStore()
const wasLoggedIn = userStore.hasLogin
const statusIcon = computed(() =>
  status.value === 'loading'
    ? LoaderCircle
    : status.value === 'authenticated' || status.value === 'bound'
      ? CircleCheck
      : status.value === 'error'
        ? CircleX
        : TriangleAlert
)
onMounted(async () => {
  if (!resultId) {
    status.value = 'error'
    description.value = '回调参数无效，登录可能已取消或状态已过期。'
    return
  }
  try {
    const result = await finish(resultId)
    if (result.outcome === 'authenticated') {
      userStore.updateToken(result.token, result.refresh)
      userStore.updateUserData(result.user)
      status.value = 'authenticated'
      description.value = '登录成功，正在返回…'
      const continuation = consumeAuthorizationContinuation()
      await router.replace(continuation || { name: wasLoggedIn ? 'user-identities' : 'user-info' })
    } else if (result.outcome === 'bound') {
      userStore.updateUserData(result.user)
      status.value = 'bound'
      description.value = '身份绑定成功，正在返回登录方式设置…'
      await router.replace({ name: 'user-identities' })
    } else if (result.outcome === 'identity_not_bound') {
      clearBindingToken()
      status.value = 'unbound'
      description.value =
        '此提供方账号尚未绑定本地账号。请先使用本地账号登录，再到“登录方式”设置中重新发起绑定。'
    } else if (result.outcome === 'binding_required') {
      setBindingToken(result.bindingToken)
      status.value = 'binding'
      description.value = '此邮箱已有账号。请使用原账号登录后确认绑定。'
    } else if (result.outcome === 'verified_email_required') {
      status.value = 'email'
      description.value = '提供方未返回已验证邮箱，无法完成登录。'
    } else {
      status.value = 'error'
      description.value = {
        cancelled: '你已取消外部登录。',
        state_invalid_or_expired: '登录状态无效或已过期，请重新发起登录。',
        provider_disabled: '该登录方式目前未启用。',
        provider_misconfigured: '该登录方式配置有误，请联系管理员。',
        provider_error: '提供方登录失败，请稍后重试。'
      }[result.outcome]
    }
  } catch (error) {
    status.value = 'error'
    description.value = error instanceof Error ? error.message : '登录失败，请重新发起登录。'
  }
})
</script>

<template>
  <UiCard class="w-[min(92vw,30rem)]"
    ><div class="grid justify-items-center gap-5 py-4 text-center" aria-live="polite">
      <span class="flex size-12 items-center justify-center rounded-full bg-muted"
        ><component
          :is="statusIcon"
          :class="['size-6', status === 'loading' && 'animate-spin motion-reduce:animate-none']"
          aria-hidden="true"
      /></span>
      <div class="grid gap-2">
        <h1 class="text-xl font-semibold">
          {{ status === 'loading' ? '处理中' : '外部登录结果' }}
        </h1>
        <p class="text-sm leading-relaxed text-muted-foreground">{{ description }}</p>
      </div>
      <UiButton v-if="status === 'binding'" @click="router.push({ name: 'login' })"
        >登录并绑定</UiButton
      ><UiButton
        v-else-if="status !== 'loading' && status !== 'authenticated'"
        variant="outline"
        @click="router.push({ name: 'login' })"
        >返回登录</UiButton
      >
    </div></UiCard
  >
</template>
