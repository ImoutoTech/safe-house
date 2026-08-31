<script setup lang="ts">
import UiAlert from '@/components/ui/ui-alert.vue'
import UiButton from '@/components/ui/ui-button.vue'
import UiField from '@/components/ui/ui-field.vue'
import UiInput from '@/components/ui/ui-input.vue'
import UiSwitch from '@/components/ui/ui-switch.vue'
import type { NotificationChannelConfig, NotificationChannelUpdate } from '@/types'

defineOptions({ name: 'NotificationChannelForm' })
const props = defineProps<{ config?: NotificationChannelConfig; loading: boolean }>()
const emit = defineEmits<{ save: [draft: NotificationChannelUpdate]; retry: [] }>()
const draft = reactive({
  enabled: false,
  host: '',
  port: 587 as number | null,
  tlsMode: 'starttls' as NotificationChannelUpdate['tlsMode'],
  username: '',
  password: '',
  fromName: '',
  fromAddress: ''
})
const errors = shallowRef<Record<string, string>>({})
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
watch(
  () => props.config,
  (config) => {
    Object.assign(draft, {
      enabled: config?.enabled ?? false,
      host: config?.host ?? '',
      port: config?.port ?? 587,
      tlsMode: config?.tlsMode ?? 'starttls',
      username: config?.username ?? '',
      password: '',
      fromName: config?.fromName ?? '',
      fromAddress: config?.fromAddress ?? ''
    })
  },
  { immediate: true }
)
const validate = () => {
  const next: Record<string, string> = {}
  if (draft.enabled) {
    if (!draft.host.trim()) next.host = '启用前请输入 SMTP Host'
    if (!Number.isInteger(draft.port) || Number(draft.port) < 1 || Number(draft.port) > 65535)
      next.port = '请输入 1 到 65535 之间的端口'
    if (!draft.username.trim()) next.username = '启用前请输入 SMTP 用户名'
    if (!props.config?.passwordConfigured && !draft.password.trim())
      next.password = '启用前请配置 SMTP 密码'
    if (!draft.fromName.trim()) next.fromName = '启用前请输入发件人名称'
    if (!emailPattern.test(draft.fromAddress.trim())) next.fromAddress = '请输入有效的 Email 地址'
  } else if (draft.fromAddress.trim() && !emailPattern.test(draft.fromAddress.trim()))
    next.fromAddress = '请输入有效的 Email 地址'
  errors.value = next
  return !Object.keys(next).length
}
const nullable = (value: string) => value.trim() || null
const submit = () => {
  if (!validate()) return
  const password = draft.password
  draft.password = ''
  emit('save', {
    enabled: draft.enabled,
    host: nullable(draft.host),
    port: draft.port,
    tlsMode: draft.tlsMode,
    username: nullable(draft.username),
    fromName: nullable(draft.fromName),
    fromAddress: nullable(draft.fromAddress),
    ...(password.trim() ? { password } : {})
  })
}
</script>

<template>
  <div class="grid gap-5">
    <UiAlert
      >SMTP 密码不会回显。保存时留空将保留现有密码；启用渠道前需完整填写连接与发件人信息。</UiAlert
    >
    <form class="grid gap-4" @submit.prevent="submit">
      <label class="flex items-center justify-between rounded-lg border p-3 text-sm font-medium"
        >启用 Email 渠道<UiSwitch v-model="draft.enabled" aria-label="启用 Email 渠道"
      /></label>
      <div class="grid gap-4 md:grid-cols-2">
        <UiField label="SMTP Host" for="smtp-host" :error="errors.host"
          ><UiInput
            id="smtp-host"
            v-model="draft.host"
            maxlength="255"
            placeholder="smtp.example.com"
            :invalid="Boolean(errors.host)"
            :aria-describedby="errors.host ? 'smtp-host-error' : undefined" /></UiField
        ><UiField label="端口" for="smtp-port" :error="errors.port"
          ><UiInput
            id="smtp-port"
            v-model.number="draft.port"
            type="number"
            min="1"
            max="65535"
            :invalid="Boolean(errors.port)"
            :aria-describedby="errors.port ? 'smtp-port-error' : undefined" /></UiField
        ><UiField label="TLS 模式" for="smtp-tls-mode"
          ><select
            id="smtp-tls-mode"
            v-model="draft.tlsMode"
            class="h-9 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <option value="none">无加密</option>
            <option value="starttls">STARTTLS</option>
            <option value="tls">TLS</option>
          </select></UiField
        ><UiField label="SMTP 用户名" for="smtp-username" :error="errors.username"
          ><UiInput
            id="smtp-username"
            v-model="draft.username"
            autocomplete="username"
            :invalid="Boolean(errors.username)"
            :aria-describedby="errors.username ? 'smtp-username-error' : undefined" /></UiField
        ><UiField
          label="SMTP 密码"
          for="smtp-password"
          :error="errors.password"
          :hint="
            config?.passwordConfigured
              ? `已配置 ${config.passwordHint || ''}；留空不修改`
              : '尚未配置密码'
          "
          ><UiInput
            id="smtp-password"
            v-model="draft.password"
            type="password"
            autocomplete="new-password"
            :invalid="Boolean(errors.password)"
            :aria-describedby="errors.password ? 'smtp-password-error' : undefined" /></UiField
        ><UiField label="默认发件人名称" for="smtp-from-name" :error="errors.fromName"
          ><UiInput
            id="smtp-from-name"
            v-model="draft.fromName"
            placeholder="Safe House"
            :invalid="Boolean(errors.fromName)"
            :aria-describedby="errors.fromName ? 'smtp-from-name-error' : undefined" /></UiField
        ><UiField label="默认发件地址" for="smtp-from-address" :error="errors.fromAddress"
          ><UiInput
            id="smtp-from-address"
            v-model="draft.fromAddress"
            type="email"
            placeholder="no-reply@example.com"
            :invalid="Boolean(errors.fromAddress)"
            :aria-describedby="errors.fromAddress ? 'smtp-from-address-error' : undefined"
        /></UiField>
      </div>
      <div class="flex justify-end gap-2">
        <UiButton
          v-if="!config"
          type="button"
          variant="outline"
          :disabled="loading"
          @click="emit('retry')"
          >重新加载</UiButton
        ><UiButton type="submit" :loading="loading" :disabled="!config">保存 SMTP 配置</UiButton>
      </div>
    </form>
  </div>
</template>
