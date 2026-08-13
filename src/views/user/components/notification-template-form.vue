<script setup lang="ts">
import type { NotificationTemplate, NotificationTemplateCreate } from '@/types'
import type { FormInst, FormRules } from 'naive-ui'

defineOptions({ name: 'NotificationTemplateForm' })

const visible = defineModel('visible', { type: Boolean })
const props = defineProps<{
  template?: NotificationTemplate
  loading: boolean
}>()
const emit = defineEmits<{
  save: [draft: NotificationTemplateCreate]
}>()

const formRef = shallowRef<FormInst>()
const draft = reactive<NotificationTemplateCreate>({
  key: '',
  name: '',
  enabled: true,
  subject: '',
  text: '',
  html: null,
  allowedVariables: []
})
const keyPattern = /^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/
const variablePattern = /^[A-Za-z_][A-Za-z0-9_]*$/
const tokenPattern = /{{\s*([A-Za-z_][A-Za-z0-9_]*)\s*}}/g

const findTemplateError = () => {
  const declared = new Set(draft.allowedVariables)
  const content = [draft.subject, draft.text, draft.html ?? ''].join('\n')
  const referenced = new Set<string>()
  for (const match of content.matchAll(tokenPattern)) referenced.add(match[1])
  const withoutTokens = content.replace(tokenPattern, '')
  if (withoutTokens.includes('{{') || withoutTokens.includes('}}')) return '模板变量语法不完整'
  const unknown = [...referenced].filter((name) => !declared.has(name))
  return unknown.length ? `未声明变量：${unknown.join('、')}` : undefined
}

const rules: FormRules = {
  key: [
    { required: true, message: '请输入模板 key', trigger: ['input', 'blur'] },
    {
      validator: (_rule, value: string) => keyPattern.test(value.trim()),
      message: 'key 需以小写字母开头，仅可使用小写字母、数字、点和横线',
      trigger: ['input', 'blur']
    }
  ],
  name: {
    validator: (_rule, value: string) => Boolean(value.trim()),
    message: '请输入模板名称',
    trigger: ['input', 'blur']
  },
  subject: [
    {
      validator: (_rule, value: string) => Boolean(value.trim()),
      message: '请输入 Email Subject',
      trigger: ['input', 'blur']
    },
    {
      validator: (_rule, value: string) => value.length <= 255,
      message: 'Subject 最多 255 个字符',
      trigger: ['input', 'blur']
    }
  ],
  text: [
    {
      validator: (_rule, value: string) => Boolean(value.trim()),
      message: '请输入纯文本正文',
      trigger: ['input', 'blur']
    },
    {
      validator: () => !findTemplateError(),
      message: () => findTemplateError() ?? '',
      trigger: ['input', 'blur']
    }
  ],
  allowedVariables: {
    validator: (_rule, value: string[]) =>
      value.length <= 50 &&
      new Set(value).size === value.length &&
      value.every((item) => variablePattern.test(item)),
    message: '变量最多 50 个，名称不可重复且只能包含字母、数字和下划线',
    trigger: 'change'
  }
}

const reset = () => {
  const template = props.template
  draft.key = template?.key ?? ''
  draft.name = template?.name ?? ''
  draft.enabled = template?.enabled ?? true
  draft.subject = template?.subject ?? ''
  draft.text = template?.text ?? ''
  draft.html = template?.html ?? null
  draft.allowedVariables = [...(template?.allowedVariables ?? [])]
}

watch(
  [() => visible.value, () => props.template],
  ([isVisible]) => {
    if (isVisible) reset()
  },
  { immediate: true }
)

const submit = async () => {
  await formRef.value?.validate()
  emit('save', {
    key: draft.key.trim(),
    name: draft.name.trim(),
    enabled: draft.enabled,
    subject: draft.subject,
    text: draft.text,
    html: draft.html?.trim() ? draft.html : null,
    allowedVariables: [...draft.allowedVariables]
  })
}
</script>

<template>
  <n-modal v-model:show="visible">
    <n-card
      class="template-dialog"
      :title="template ? '编辑消息模板' : '新建消息模板'"
      :bordered="false"
      role="dialog"
      aria-modal="true"
    >
      <n-form ref="formRef" :model="draft" :rules="rules" label-placement="top">
        <n-grid cols="1 768:2" :x-gap="16">
          <n-form-item-gi label="模板 key" path="key">
            <n-input
              v-model:value="draft.key"
              :disabled="Boolean(template)"
              maxlength="100"
              placeholder="account.verify-email"
            />
          </n-form-item-gi>
          <n-form-item-gi label="模板名称" path="name">
            <n-input v-model:value="draft.name" maxlength="191" />
          </n-form-item-gi>
        </n-grid>
        <n-form-item label="允许变量" path="allowedVariables">
          <n-dynamic-tags v-model:value="draft.allowedVariables" />
          <template #feedback
            >正文中仅可使用这里声明的 {{ '{' }}{variable}{{ '}' }} 变量。</template
          >
        </n-form-item>
        <n-form-item label="Email Subject" path="subject">
          <n-input v-model:value="draft.subject" maxlength="255" show-count />
        </n-form-item>
        <n-form-item label="纯文本正文" path="text">
          <n-input
            v-model:value="draft.text"
            type="textarea"
            maxlength="102400"
            :autosize="{ minRows: 5, maxRows: 12 }"
          />
        </n-form-item>
        <n-form-item label="HTML 正文（可选，仅源码）" path="html">
          <n-input
            v-model:value="draft.html"
            type="textarea"
            maxlength="204800"
            :autosize="{ minRows: 5, maxRows: 12 }"
          />
        </n-form-item>
        <n-flex justify="space-between" align="center">
          <n-checkbox v-if="!template" v-model:checked="draft.enabled">保存后启用</n-checkbox>
          <n-text v-else depth="3">启用状态请在模板列表中单独修改。</n-text>
          <n-flex>
            <n-button :disabled="loading" @click="visible = false">取消</n-button>
            <n-button type="primary" :loading="loading" @click="submit">保存模板</n-button>
          </n-flex>
        </n-flex>
      </n-form>
    </n-card>
  </n-modal>
</template>

<style scoped lang="scss">
.template-dialog {
  display: flex;
  width: min(760px, 95vw);
  max-height: 90vh;
  max-height: 90dvh;
}

.template-dialog :deep(.n-card__content) {
  min-height: 0;
  overflow-y: auto;
}
</style>
