<script setup lang="ts">
import type { ProviderProjection, ProviderUpdate } from '@/types'
import type { FormInst, FormRules } from 'naive-ui'

const props = defineProps<{ provider: ProviderProjection; loading: boolean }>()
const emit = defineEmits<{
  save: [provider: ProviderProjection['provider'], data: ProviderUpdate]
}>()
const draft = reactive({
  clientId: props.provider.clientId ?? '',
  clientSecret: '',
  enabled: props.provider.enabled
})
const rules: FormRules = {
  clientId: [
    {
      validator: () => !draft.enabled || Boolean(draft.clientId.trim()),
      message: '启用前请输入 Client ID',
      trigger: ['input', 'blur']
    }
  ]
}
const formRef = shallowRef<FormInst>()

watch(
  () => props.provider,
  (provider) => {
    draft.clientId = provider.clientId ?? ''
    draft.clientSecret = ''
    draft.enabled = provider.enabled
  }
)

const submit = async () => {
  await formRef.value?.validate()
  const data = { ...draft }
  draft.clientSecret = ''
  emit('save', props.provider.provider, data)
}
</script>

<template>
  <n-card :title="provider.provider === 'github' ? 'GitHub' : 'Google'">
    <n-form ref="formRef" :model="draft" :rules="rules" label-placement="top">
      <n-form-item label="Client ID" path="clientId"
        ><n-input v-model:value="draft.clientId"
      /></n-form-item>
      <n-form-item label="Client Secret（留空则不修改）">
        <n-input v-model:value="draft.clientSecret" type="password" show-password-on="click" />
        <template #feedback>{{
          provider.configured ? `已配置 ${provider.secretHint || ''}` : '尚未配置'
        }}</template>
      </n-form-item>
      <n-form-item label="启用"><n-switch v-model:value="draft.enabled" /></n-form-item>
      <n-button
        v-permission="'oauth-provider-admin'"
        type="primary"
        :loading="loading"
        @click="submit"
        >保存</n-button
      >
    </n-form>
  </n-card>
</template>
