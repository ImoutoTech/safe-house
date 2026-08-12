<script setup lang="ts">
import type { NotificationChannelConfig, NotificationChannelUpdate } from '@/types'
import type { FormInst, FormRules } from 'naive-ui'

defineOptions({ name: 'NotificationChannelForm' })

const props = defineProps<{
  config?: NotificationChannelConfig
  loading: boolean
}>()
const emit = defineEmits<{
  save: [draft: NotificationChannelUpdate]
  retry: []
}>()

const formRef = shallowRef<FormInst>()
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
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const requiredWhenEnabled = (value: string | null) =>
  !draft.enabled || Boolean(String(value ?? '').trim())

const rules: FormRules = {
  host: {
    validator: (_rule, value: string) => requiredWhenEnabled(value),
    message: '启用前请输入 SMTP Host',
    trigger: ['input', 'blur']
  },
  port: {
    validator: (_rule, value: number | null) =>
      !draft.enabled || (Number.isInteger(value) && Number(value) >= 1 && Number(value) <= 65535),
    message: '请输入 1 到 65535 之间的端口',
    trigger: ['input', 'blur']
  },
  username: {
    validator: (_rule, value: string) => requiredWhenEnabled(value),
    message: '启用前请输入 SMTP 用户名',
    trigger: ['input', 'blur']
  },
  password: {
    validator: (_rule, value: string) =>
      !draft.enabled || props.config?.passwordConfigured || Boolean(value.trim()),
    message: '启用前请配置 SMTP 密码',
    trigger: ['input', 'blur']
  },
  fromName: {
    validator: (_rule, value: string) => requiredWhenEnabled(value),
    message: '启用前请输入默认发件人名称',
    trigger: ['input', 'blur']
  },
  fromAddress: [
    {
      validator: (_rule, value: string) => requiredWhenEnabled(value),
      message: '启用前请输入默认发件地址',
      trigger: ['input', 'blur']
    },
    {
      validator: (_rule, value: string) => !value.trim() || emailPattern.test(value.trim()),
      message: '请输入有效的 Email 地址',
      trigger: ['input', 'blur']
    }
  ]
}

watch(
  () => props.config,
  (config) => {
    draft.enabled = config?.enabled ?? false
    draft.host = config?.host ?? ''
    draft.port = config?.port ?? 587
    draft.tlsMode = config?.tlsMode ?? 'starttls'
    draft.username = config?.username ?? ''
    draft.password = ''
    draft.fromName = config?.fromName ?? ''
    draft.fromAddress = config?.fromAddress ?? ''
  },
  { immediate: true }
)

const nullable = (value: string) => value.trim() || null

const submit = async () => {
  await formRef.value?.validate()
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
  <section class="channel-form">
    <n-alert type="info" :bordered="false">
      SMTP 密码不会回显。保存时留空将保留现有密码；启用渠道前需完整填写连接与发件人信息。
    </n-alert>
    <n-form ref="formRef" class="channel-form__body" :model="draft" :rules="rules">
      <n-form-item label="启用 Email 渠道">
        <n-switch v-model:value="draft.enabled" aria-label="启用 Email 渠道" />
      </n-form-item>
      <n-grid cols="1 768:2" :x-gap="16">
        <n-form-item-gi label="SMTP Host" path="host">
          <n-input v-model:value="draft.host" maxlength="255" placeholder="smtp.example.com" />
        </n-form-item-gi>
        <n-form-item-gi label="端口" path="port">
          <n-input-number v-model:value="draft.port" :min="1" :max="65535" class="full-width" />
        </n-form-item-gi>
        <n-form-item-gi label="TLS 模式" path="tlsMode">
          <n-select
            v-model:value="draft.tlsMode"
            :options="[
              { label: '无加密', value: 'none' },
              { label: 'STARTTLS', value: 'starttls' },
              { label: 'TLS', value: 'tls' }
            ]"
          />
        </n-form-item-gi>
        <n-form-item-gi label="SMTP 用户名" path="username">
          <n-input v-model:value="draft.username" maxlength="255" autocomplete="username" />
        </n-form-item-gi>
        <n-form-item-gi label="SMTP 密码（留空则不修改）" path="password">
          <n-input
            v-model:value="draft.password"
            type="password"
            show-password-on="click"
            autocomplete="new-password"
            maxlength="2048"
          />
          <template #feedback>
            {{
              config?.passwordConfigured ? `已配置 ${config.passwordHint || ''}` : '尚未配置密码'
            }}
          </template>
        </n-form-item-gi>
        <n-form-item-gi label="默认发件人名称" path="fromName">
          <n-input v-model:value="draft.fromName" maxlength="191" placeholder="Safe House" />
        </n-form-item-gi>
        <n-form-item-gi label="默认发件地址" path="fromAddress">
          <n-input
            v-model:value="draft.fromAddress"
            maxlength="320"
            placeholder="no-reply@example.com"
          />
        </n-form-item-gi>
      </n-grid>
      <n-flex justify="end">
        <n-button v-if="!config" secondary :disabled="loading" @click="emit('retry')">
          重新加载
        </n-button>
        <n-button type="primary" :loading="loading" :disabled="!config" @click="submit">
          保存 SMTP 配置
        </n-button>
      </n-flex>
    </n-form>
  </section>
</template>

<style scoped lang="scss">
.channel-form__body {
  margin-top: 18px;
}

.full-width {
  width: 100%;
}
</style>
