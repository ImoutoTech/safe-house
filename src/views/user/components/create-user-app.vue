<script setup lang="ts">
import { z } from 'zod'
import UiButton from '@/components/ui/ui-button.vue'
import UiDialog from '@/components/ui/ui-dialog.vue'
import UiField from '@/components/ui/ui-field.vue'
import UiInput from '@/components/ui/ui-input.vue'
import { useCreateApp } from '@/composables/useCreateApp'
import { useFormValidation } from '@/composables/useFormValidation'
import type { UserAppRegParams } from '@/types'

defineOptions({ name: 'CreateUserApp' })
const visible = defineModel('visible', { type: Boolean })
const emit = defineEmits<{ create: [] }>()
const schema = z.object({
  name: z.string().trim().min(1, '请输入应用名'),
  description: z.string(),
  callback: z.string().trim().url('请输入有效的回调地址')
})
const { errors, validate, clear } = useFormValidation<UserAppRegParams>(schema)
const { params, loading, reset, submit } = useCreateApp(() => {
  visible.value = false
  emit('create')
})
const handleSubmit = () => {
  if (validate({ ...params.value })) submit()
}
watch(visible, (shown) => {
  if (shown) {
    reset()
    clear()
  }
})
</script>

<template>
  <UiDialog
    v-model:open="visible"
    title="创建子应用"
    description="为 OAuth/OIDC 客户端设置基本信息。"
    ><form class="grid gap-4" @submit.prevent="handleSubmit">
      <UiField label="应用名" for="create-app-name" :error="errors.name"
        ><template #default="field"
          ><UiInput
            id="create-app-name"
            v-model="params.name"
            placeholder="新的子应用"
            :invalid="field.invalid"
            :aria-describedby="field.describedBy"
            @update:model-value="clear('name')" /></template></UiField
      ><UiField label="描述" for="create-app-description"
        ><UiInput
          id="create-app-description"
          v-model="params.description"
          placeholder="本地 / 测试 / 正式" /></UiField
      ><UiField label="回调地址" for="create-app-callback" :error="errors.callback"
        ><template #default="field"
          ><UiInput
            id="create-app-callback"
            v-model="params.callback"
            type="url"
            placeholder="https://example.com/callback"
            :invalid="field.invalid"
            :aria-describedby="field.describedBy"
            @update:model-value="clear('callback')" /></template></UiField
      ><UiButton type="submit" block :loading="loading">保存</UiButton>
    </form></UiDialog
  >
</template>
