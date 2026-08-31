<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'
import { useClipboard } from '@vueuse/core'
import CredentialSnippet from '@/components/patterns/credential-snippet.vue'
import EmptyState from '@/components/patterns/empty-state.vue'
import UiButton from '@/components/ui/ui-button.vue'
import UiConfirmDialog from '@/components/ui/ui-confirm-dialog.vue'
import UiDialog from '@/components/ui/ui-dialog.vue'
import UiSpinner from '@/components/ui/ui-spinner.vue'
import UiSwitch from '@/components/ui/ui-switch.vue'
import { useAppSecret } from '@/composables/useAppSecret'
import { useFeedback } from '@/composables/useFeedback'
import type { AppInfo } from '@/types'
import { PERMISSION_CODE_MAP } from '@/utils/constants'
import NotificationApiKeys from './notification-api-keys.vue'

defineOptions({ name: 'UserAppSecret' })
const visible = defineModel('visible', { type: Boolean })
const props = defineProps<{ app?: AppInfo }>()
const { copy } = useClipboard()
const feedback = useFeedback()
const { data, loading, createLoading, deleteLoading, updateApp, create, del, toggle } =
  useAppSecret()
const secrets = computed(() => data.value?.data || [])
const confirmOpen = shallowRef(false)
const selectedSecret = shallowRef<number>()
const plaintextOpen = shallowRef(false)
const plaintext = shallowRef('')
watch(
  visible,
  (shown) => {
    plaintext.value = ''
    plaintextOpen.value = false
    if (props.app && shown) updateApp(props.app.id)
  },
  { immediate: true }
)
const handleCreate = async () => {
  const value = await create()
  if (!value) return
  plaintext.value = value
  plaintextOpen.value = true
}
const requestDelete = (id: number) => {
  selectedSecret.value = id
  confirmOpen.value = true
}
const handleDelete = async () => {
  if (selectedSecret.value === undefined) return
  if (await del(selectedSecret.value)) confirmOpen.value = false
}
const copyValue = async (value: string) => {
  await copy(value)
  feedback.success('凭据已复制')
}
const acknowledgePlaintext = () => {
  plaintextOpen.value = false
  plaintext.value = ''
}
</script>

<template>
  <UiDialog
    v-model:open="visible"
    title="子应用凭据"
    :description="app ? `${app.name} 的 OIDC 与通知调用凭据` : ''"
    class="max-w-2xl"
    ><div class="grid gap-6">
      <section class="grid gap-3">
        <header class="flex items-center justify-between gap-4">
          <div>
            <h3 class="font-medium">OIDC Client Secret</h3>
            <p class="text-sm text-muted-foreground">用于 OIDC 客户端认证，新建值只显示一次。</p>
          </div>
          <UiButton
            v-permission="PERMISSION_CODE_MAP['修改子应用']"
            size="sm"
            variant="outline"
            :loading="createLoading"
            @click="handleCreate"
            >新建</UiButton
          >
        </header>
        <div v-if="loading" class="py-6 text-center"><UiSpinner /></div>
        <div v-else-if="secrets.length" class="divide-y rounded-lg border">
          <div
            v-for="secret in secrets"
            :key="secret.id"
            class="flex items-center justify-between gap-3 p-3"
          >
            <code class="min-w-0 truncate font-mono text-xs">{{ secret.value }}</code>
            <div class="flex items-center gap-2">
              <UiSwitch
                v-permission="{ permission: PERMISSION_CODE_MAP['修改子应用'], mode: 'disable' }"
                :model-value="secret.enabled"
                :aria-label="`${secret.value} 启用状态`"
                @update:model-value="toggle(secret.id)"
              /><UiButton
                v-permission="PERMISSION_CODE_MAP['修改子应用']"
                size="icon"
                variant="ghost"
                class="text-destructive"
                aria-label="删除 Client Secret"
                @click="requestDelete(secret.id)"
                ><Trash2
              /></UiButton>
            </div>
          </div>
        </div>
        <EmptyState v-else title="暂无 Client Secret" description="创建后请立即安全保存。" />
      </section>
      <NotificationApiKeys v-if="app" :app-id="app.id" :active="Boolean(visible)" /></div></UiDialog
  ><UiConfirmDialog
    v-model:open="confirmOpen"
    title="删除 Client Secret"
    description="删除后依赖此凭据的客户端会立即无法认证。"
    confirm-text="删除"
    destructive
    :loading="deleteLoading"
    @confirm="handleDelete"
  /><UiDialog
    v-model:open="plaintextOpen"
    title="保存新的 Client Secret"
    description="明文仅显示这一次，关闭后会从本地状态清除。"
    blocking
    ><CredentialSnippet :value="plaintext" label="OIDC Client Secret" @copy="copyValue" /><template
      #footer
      ><UiButton @click="acknowledgePlaintext">我已安全保存</UiButton></template
    ></UiDialog
  >
</template>
