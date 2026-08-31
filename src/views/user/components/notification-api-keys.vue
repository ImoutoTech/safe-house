<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'
import { useClipboard } from '@vueuse/core'
import dayjs from 'dayjs'
import CredentialSnippet from '@/components/patterns/credential-snippet.vue'
import EmptyState from '@/components/patterns/empty-state.vue'
import UiAlert from '@/components/ui/ui-alert.vue'
import UiButton from '@/components/ui/ui-button.vue'
import UiConfirmDialog from '@/components/ui/ui-confirm-dialog.vue'
import UiDialog from '@/components/ui/ui-dialog.vue'
import UiSpinner from '@/components/ui/ui-spinner.vue'
import UiSwitch from '@/components/ui/ui-switch.vue'
import { useFeedback } from '@/composables/useFeedback'
import { useNotificationKeys } from '@/composables/useNotificationKeys'
import { PERMISSION_CODE_MAP } from '@/utils/constants'

defineOptions({ name: 'NotificationApiKeys' })
const props = defineProps<{ appId: string; active: boolean }>()
const { keys, loading, createLoading, error, updateApp, refresh, create, toggle, remove } =
  useNotificationKeys()
const plaintextVisible = shallowRef(false)
const plaintext = shallowRef('')
const confirmOpen = shallowRef(false)
const selectedKey = shallowRef('')
const { copy } = useClipboard()
const feedback = useFeedback()
watch(
  [() => props.active, () => props.appId],
  ([active, appId]) => {
    plaintextVisible.value = false
    plaintext.value = ''
    if (active && appId) void updateApp(appId)
  },
  { immediate: true }
)
onBeforeUnmount(() => {
  plaintext.value = ''
})
const handleCreate = async () => {
  const value = await create()
  if (!value) return
  plaintext.value = value
  plaintextVisible.value = true
}
const copyPlaintext = async (value: string) => {
  await copy(value)
  feedback.success('通知 API Key 已复制')
}
const requestRemove = (id: string) => {
  selectedKey.value = id
  confirmOpen.value = true
}
const handleRemove = async () => {
  if (await remove(selectedKey.value)) confirmOpen.value = false
}
const acknowledgePlaintext = () => {
  plaintextVisible.value = false
  plaintext.value = ''
}
</script>

<template>
  <section class="grid gap-3 border-t pt-5">
    <header class="flex items-center justify-between gap-4">
      <div>
        <h3 class="font-medium">通知 API Key</h3>
        <p class="text-sm text-muted-foreground">仅用于调用通知 API，不复用 OIDC Client Secret。</p>
      </div>
      <UiButton
        v-permission="PERMISSION_CODE_MAP['修改子应用']"
        size="sm"
        variant="outline"
        :loading="createLoading"
        :disabled="loading"
        @click="handleCreate"
        >新建</UiButton
      >
    </header>
    <UiAlert v-if="error" variant="destructive" title="加载失败"
      ><UiButton size="sm" variant="outline" class="mt-2" @click="refresh">重试</UiButton></UiAlert
    >
    <div v-if="loading && !keys.length" class="py-6 text-center"><UiSpinner /></div>
    <div v-else-if="keys.length" class="divide-y rounded-lg border">
      <div v-for="key in keys" :key="key.id" class="flex items-center justify-between gap-3 p-3">
        <div class="min-w-0">
          <code class="text-xs">{{ key.hint }}</code>
          <p class="mt-1 text-xs text-muted-foreground">
            创建于 {{ dayjs(key.createdAt).format('YYYY-MM-DD HH:mm')
            }}<template v-if="key.lastUsedAt">
              · 最后使用 {{ dayjs(key.lastUsedAt).fromNow() }}</template
            >
          </p>
        </div>
        <div class="flex items-center gap-2">
          <UiSwitch
            v-permission="{ permission: PERMISSION_CODE_MAP['修改子应用'], mode: 'disable' }"
            :model-value="key.enabled"
            :disabled="loading"
            :aria-label="`${key.hint} 启用状态`"
            @update:model-value="toggle(key.id, $event)"
          /><UiButton
            v-permission="PERMISSION_CODE_MAP['修改子应用']"
            size="icon"
            variant="ghost"
            class="text-destructive"
            aria-label="吊销通知 API Key"
            @click="requestRemove(key.id)"
            ><Trash2
          /></UiButton>
        </div>
      </div>
    </div>
    <EmptyState v-else title="暂无通知 API Key" description="新建后请立即保存明文。" />
  </section>
  <UiConfirmDialog
    v-model:open="confirmOpen"
    title="吊销通知 API Key"
    description="吊销后无法恢复，依赖此 Key 的调用会立即失败。"
    confirm-text="确认吊销"
    destructive
    :loading="loading"
    @confirm="handleRemove"
  /><UiDialog
    v-model:open="plaintextVisible"
    title="保存新的通知 API Key"
    description="关闭后 Safe House 会立即清除本地临时值。"
    blocking
    ><CredentialSnippet
      :value="plaintext"
      label="Notification API Key"
      @copy="copyPlaintext"
    /><template #footer
      ><UiButton @click="acknowledgePlaintext">我已安全保存</UiButton></template
    ></UiDialog
  >
</template>
