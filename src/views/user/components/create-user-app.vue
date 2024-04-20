<template>
  <n-modal v-model:show="visible">
    <n-card
      class="common-dialog"
      title="创建子应用"
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
        <n-form-item label="回调地址" path="callback">
          <n-input v-model:value="params.callback" placeholder="https://example.com"></n-input>
        </n-form-item>
      </n-form>
      <n-button :loading="loading" block secondary type="info" @click="handleSubmit">保存</n-button>
    </n-card>
  </n-modal>
</template>
<script setup lang="ts">
import { useCreateApp } from '@/composables/useCreateApp'
import type { FormInst } from 'naive-ui'

defineOptions({
  name: 'CreateUserApp'
})

const visible = defineModel('visible', { type: Boolean })
const formRef = ref<FormInst>()
const emit = defineEmits<{
  (e: 'create'): void
}>()

const formRules = {
  name: [{ required: true, message: '请输入应用名' }],
  callback: [{ required: true, message: '请输入回调地址' }]
}

const { params, loading, reset, submit } = useCreateApp(() => {
  visible.value = false
  emit('create')
})

const handleSubmit = () => {
  formRef.value?.validate((errors) => {
    if (errors) return

    submit()
  })
}

watch(() => visible.value, reset, {
  immediate: true
})
</script>
