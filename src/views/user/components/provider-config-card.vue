<script setup lang="ts">
import UiButton from '@/components/ui/ui-button.vue'
import UiField from '@/components/ui/ui-field.vue'
import UiInput from '@/components/ui/ui-input.vue'
import UiSwitch from '@/components/ui/ui-switch.vue'
import type { ProviderProjection, ProviderUpdate } from '@/types'

defineOptions({ name: 'ProviderConfigCard' })
const props = defineProps<{ provider: ProviderProjection; loading: boolean }>()
const emit = defineEmits<{
  save: [provider: ProviderProjection['provider'], data: ProviderUpdate]
}>()
const draft = reactive({
  clientId: props.provider.clientId ?? '',
  clientSecret: '',
  enabled: props.provider.enabled
})
const errors = shallowRef<{ clientId?: string; clientSecret?: string }>({})
watch(
  () => props.provider,
  (provider) => {
    draft.clientId = provider.clientId ?? ''
    draft.clientSecret = ''
    draft.enabled = provider.enabled
  }
)
const submit = () => {
  const next: typeof errors.value = {}
  if (draft.enabled && !draft.clientId.trim()) {
    next.clientId = '启用前请输入 Client ID'
  }
  if (draft.enabled && !props.provider.configured && !draft.clientSecret.trim()) {
    next.clientSecret = '首次启用前请输入 Client Secret'
  }
  errors.value = next
  if (Object.keys(next).length) return
  const data = { ...draft }
  draft.clientSecret = ''
  emit('save', props.provider.provider, data)
}
</script>

<template>
  <form class="grid gap-4 rounded-lg bg-muted/40 p-4" @submit.prevent="submit">
    <header class="flex items-center justify-between gap-3">
      <div>
        <h3 class="font-medium">{{ provider.provider === 'github' ? 'GitHub' : 'Google' }}</h3>
        <p class="text-xs text-muted-foreground">
          {{ provider.configured ? `已配置 ${provider.secretHint || ''}` : '尚未配置' }}
        </p>
      </div>
      <UiSwitch v-model="draft.enabled" :aria-label="`${provider.provider} 登录方式`" />
    </header>
    <UiField label="Client ID" :for="`${provider.provider}-client-id`" :error="errors.clientId"
      ><template #default="field"
        ><UiInput
          :id="`${provider.provider}-client-id`"
          v-model="draft.clientId"
          autocomplete="off"
          :invalid="field.invalid"
          :aria-describedby="field.describedBy"
          @update:model-value="errors = { ...errors, clientId: undefined }" /></template></UiField
    ><UiField
      label="Client Secret"
      :for="`${provider.provider}-client-secret`"
      :error="errors.clientSecret"
      :hint="provider.configured ? '留空将保留现有密钥' : '启用前需要配置密钥'"
      ><template #default="field"
        ><UiInput
          :id="`${provider.provider}-client-secret`"
          v-model="draft.clientSecret"
          type="password"
          autocomplete="new-password"
          :invalid="field.invalid"
          :aria-describedby="field.describedBy"
          @update:model-value="
            errors = { ...errors, clientSecret: undefined }
          " /></template></UiField
    ><UiButton type="submit" block :loading="loading">保存</UiButton>
  </form>
</template>
