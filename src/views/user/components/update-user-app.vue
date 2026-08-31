<script setup lang="ts">
import { z } from 'zod'
import UiButton from '@/components/ui/ui-button.vue'
import UiDialog from '@/components/ui/ui-dialog.vue'
import UiField from '@/components/ui/ui-field.vue'
import UiInput from '@/components/ui/ui-input.vue'
import { useEditApp } from '@/composables/useEditApp'
import { useFormValidation } from '@/composables/useFormValidation'
import { AppStatus, type AppInfo, type UserAppUpdateParams } from '@/types'
import { STATUS_NAME_MAP } from '@/utils/constants'

defineOptions({ name: 'UpdateUserApp' })
const visible = defineModel('visible', { type: Boolean })
const props = defineProps<{ app?: AppInfo }>()
const emit = defineEmits<{ update: [] }>()
const schema = z.object({
  name: z.string().trim().min(1, '请输入应用名'),
  description: z.string(),
  callback: z.string().trim().url('请输入有效的回调地址'),
  status: z.enum(AppStatus)
})
const { errors, validate, clear } = useFormValidation<UserAppUpdateParams>(schema)
const options = [
  { label: STATUS_NAME_MAP[AppStatus.RUNNING], value: AppStatus.RUNNING },
  { label: STATUS_NAME_MAP[AppStatus.CLOSED], value: AppStatus.CLOSED }
]
const { params, loading, submit, setApp } = useEditApp(() => {
  visible.value = false
  emit('update')
})
const handleSubmit = () => {
  if (validate({ ...params.value })) submit()
}
watch(
  visible,
  (shown) => {
    if (shown && props.app) {
      setApp(props.app)
      clear()
    }
  },
  { immediate: true }
)
</script>

<template>
  <UiDialog
    v-model:open="visible"
    title="编辑子应用"
    description="更新展示信息、运行状态和回调地址。"
    ><form class="grid gap-4" @submit.prevent="handleSubmit">
      <UiField label="应用名" for="edit-app-name" :error="errors.name"
        ><template #default="field"
          ><UiInput
            id="edit-app-name"
            v-model="params.name"
            :invalid="field.invalid"
            :aria-describedby="field.describedBy"
            @update:model-value="clear('name')" /></template></UiField
      ><UiField label="描述" for="edit-app-description"
        ><UiInput id="edit-app-description" v-model="params.description"
      /></UiField>
      <fieldset class="grid gap-2">
        <legend class="text-sm font-medium leading-none">状态</legend>
        <div class="flex gap-4">
          <label v-for="item in options" :key="item.value" class="flex items-center gap-2 text-sm"
            ><input
              v-model="params.status"
              type="radio"
              :value="item.value"
              class="size-4 accent-foreground"
            />{{ item.label }}</label
          >
        </div>
      </fieldset>
      <UiField label="回调地址" for="edit-app-callback" :error="errors.callback"
        ><template #default="field"
          ><UiInput
            id="edit-app-callback"
            v-model="params.callback"
            type="url"
            :invalid="field.invalid"
            :aria-describedby="field.describedBy"
            @update:model-value="clear('callback')" /></template></UiField
      ><UiButton type="submit" block :loading="loading">保存</UiButton>
    </form></UiDialog
  >
</template>
