<template>
  <n-modal v-model:show="visible">
    <n-card
      style="width: 400px"
      title="编辑子应用"
      :bordered="false"
      role="dialog"
      aria-modal="true"
    >
      <n-form ref="formRef" :model="params" :rules="formRules">
        <n-form-item label="应用名" path="name">
          <n-input v-model:value="params.name" placeholder="新的子应用"></n-input>
        </n-form-item>
        <n-form-item label="描述" path="description">
          <n-input v-model:value="params.description" placeholder="本地/测试/正式"></n-input>
        </n-form-item>
        <n-form-item label="状态" path="status">
          <n-radio-group v-model:value="params.status">
            <n-flex>
              <n-radio
                v-for="item in appStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </n-flex>
          </n-radio-group>
        </n-form-item>
        <n-form-item label="回调地址" path="callback">
          <n-input v-model:value="params.callback" placeholder="https://example.com"></n-input>
        </n-form-item>
      </n-form>
      <n-button :loading="loading" block secondary type="info" @click="handleSubmit">保存</n-button>
    </n-card>
  </n-modal>
</template>
<script setup lang="ts">
import { useEditApp } from '@/composables/useEditApp'
import { AppStatus, type AppInfo } from '@/types'
import { STATUS_NAME_MAP } from '@/utils/constants'
import type { FormInst } from 'naive-ui'

defineOptions({
  name: 'UpdateUserApp'
})

const visible = defineModel('visible', { type: Boolean })
const formRef = ref<FormInst>()
const props = defineProps<{
  app?: AppInfo
}>()

const emit = defineEmits<{
  (e: 'update'): void
}>()

const formRules = {
  name: [{ required: true, message: '请输入应用名' }],
  callback: [{ required: true, message: '请输入回调地址' }]
}

const appStatusOptions = [
  {
    label: STATUS_NAME_MAP[AppStatus.RUNNING],
    value: AppStatus.RUNNING
  },
  {
    label: STATUS_NAME_MAP[AppStatus.CLOSED],
    value: AppStatus.CLOSED
  }
]

const { params, loading, submit, setApp } = useEditApp(() => {
  visible.value = false
  emit('update')
})

const handleSubmit = () => {
  formRef.value?.validate((errors) => {
    if (errors) return

    submit()
  })
}

watch(
  () => visible.value,
  () => {
    if (props.app) {
      setApp(props.app)
    }
  },
  {
    immediate: true
  }
)
</script>
