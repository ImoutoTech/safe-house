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
  <section class="provider-config">
    <header class="provider-config__header">
      <h2 class="provider-config__title">
        {{ provider.provider === 'github' ? 'GitHub' : 'Google' }}
      </h2>
      <n-switch
        v-model:value="draft.enabled"
        :aria-label="`${provider.provider === 'github' ? 'GitHub' : 'Google'} 登录方式`"
      />
    </header>
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
      <n-flex justify="end">
        <n-button type="primary" :loading="loading" @click="submit">保存</n-button>
      </n-flex>
    </n-form>
  </section>
</template>

<style scoped>
.provider-config {
  padding: 0 8px 24px;
}

.provider-config__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgb(239, 239, 245);
}

.provider-config__title {
  margin: 0;
  color: rgb(31, 34, 37);
  font-size: 16px;
  font-weight: 500;
  line-height: 1.6;
}
</style>
