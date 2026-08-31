<script setup lang="ts">
import EmptyState from '@/components/patterns/empty-state.vue'
import UiAlert from '@/components/ui/ui-alert.vue'
import UiButton from '@/components/ui/ui-button.vue'
import UiConfirmDialog from '@/components/ui/ui-confirm-dialog.vue'
import UiSpinner from '@/components/ui/ui-spinner.vue'
import { useExternalIdentities } from '@/composables/useExternalIdentities'
import { useExternalLogin } from '@/composables/useExternalLogin'
import type { LinkedIdentity } from '@/types'

defineOptions({ name: 'UserIdentities' })
const route = useRoute()
const { identities, loading, error, unbind, startBinding, refresh } = useExternalIdentities()
const { providers } = useExternalLogin()
const selected = shallowRef<LinkedIdentity>()
const confirmOpen = shallowRef(false)
const linkedProviders = computed(() => new Set(identities.value.map((item) => item.provider)))
const availableProviders = computed(() =>
  providers.value.filter((item) => !linkedProviders.value.has(item.provider))
)
const providerLabel = (provider: string) =>
  provider === 'github' ? 'GitHub' : provider === 'google' ? 'Google' : provider
const confirmUnbind = (identity: LinkedIdentity) => {
  selected.value = identity
  confirmOpen.value = true
}
const handleUnbind = async () => {
  if (!selected.value) return
  if (await unbind(selected.value.id)) confirmOpen.value = false
}
</script>

<template>
  <section class="grid gap-4">
    <div v-if="loading" class="py-8 text-center"><UiSpinner label="正在读取登录方式" /></div>
    <div v-else-if="error" class="grid gap-3">
      <UiAlert variant="destructive" title="身份操作失败">{{ error.message }}</UiAlert
      ><UiButton variant="outline" class="w-fit" @click="refresh()">重试</UiButton>
    </div>
    <EmptyState
      v-else-if="!identities.length && !availableProviders.length"
      title="暂无外部登录方式"
      description="管理员启用提供方后，你可以在这里绑定。"
    />
    <div v-else class="divide-y rounded-lg border">
      <div
        v-for="identity in identities"
        :key="`linked-${identity.id}`"
        class="flex items-center justify-between gap-4 p-4"
      >
        <div class="min-w-0">
          <strong>{{ providerLabel(identity.provider) }}</strong>
          <p class="truncate text-sm text-muted-foreground">
            {{ identity.email || identity.displayName || '已绑定' }}
          </p>
        </div>
        <UiButton
          variant="ghost"
          class="text-destructive"
          :disabled="loading"
          @click="confirmUnbind(identity)"
          >解绑</UiButton
        >
      </div>
      <div
        v-for="provider in availableProviders"
        :key="`available-${provider.provider}`"
        class="flex items-center justify-between gap-4 p-4"
      >
        <div>
          <strong>{{ providerLabel(provider.provider) }}</strong>
          <p class="text-sm text-muted-foreground">尚未绑定</p>
        </div>
        <UiButton
          variant="outline"
          :disabled="loading"
          @click="startBinding(provider.provider, route.fullPath)"
          >去绑定</UiButton
        >
      </div>
    </div>
  </section>
  <UiConfirmDialog
    v-model:open="confirmOpen"
    title="确认解绑"
    :description="`确定解绑 ${selected ? providerLabel(selected.provider) : ''} 身份吗？`"
    confirm-text="解绑"
    destructive
    :loading="loading"
    @confirm="handleUnbind"
  />
</template>
