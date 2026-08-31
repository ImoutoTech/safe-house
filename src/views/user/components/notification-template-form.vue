<script setup lang="ts">
import { Plus, X } from 'lucide-vue-next'
import UiBadge from '@/components/ui/ui-badge.vue'
import UiButton from '@/components/ui/ui-button.vue'
import UiDialog from '@/components/ui/ui-dialog.vue'
import UiField from '@/components/ui/ui-field.vue'
import UiInput from '@/components/ui/ui-input.vue'
import UiTextarea from '@/components/ui/ui-textarea.vue'
import type { NotificationTemplate, NotificationTemplateCreate } from '@/types'

defineOptions({ name: 'NotificationTemplateForm' })
const visible = defineModel('visible', { type: Boolean })
const props = defineProps<{ template?: NotificationTemplate; loading: boolean }>()
const emit = defineEmits<{ save: [draft: NotificationTemplateCreate] }>()
const draft = reactive<NotificationTemplateCreate>({
  key: '',
  name: '',
  enabled: true,
  subject: '',
  text: '',
  html: null,
  allowedVariables: []
})
const variableInput = shallowRef('')
const errors = shallowRef<Record<string, string>>({})
const keyPattern = /^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/
const variablePattern = /^[A-Za-z_][A-Za-z0-9_]*$/
const tokenPattern = /{{\s*([A-Za-z_][A-Za-z0-9_]*)\s*}}/g
const reset = () => {
  const t = props.template
  Object.assign(draft, {
    key: t?.key ?? '',
    name: t?.name ?? '',
    enabled: t?.enabled ?? true,
    subject: t?.subject ?? '',
    text: t?.text ?? '',
    html: t?.html ?? null,
    allowedVariables: [...(t?.allowedVariables ?? [])]
  })
  variableInput.value = ''
  errors.value = {}
}
watch(
  [visible, () => props.template],
  ([shown]) => {
    if (shown) reset()
  },
  { immediate: true }
)
const addVariable = () => {
  const value = variableInput.value.trim()
  if (
    !value ||
    !variablePattern.test(value) ||
    draft.allowedVariables.includes(value) ||
    draft.allowedVariables.length >= 50
  ) {
    errors.value = {
      ...errors.value,
      variables: '变量需唯一，只能包含字母、数字和下划线，最多 50 个'
    }
    return
  }
  draft.allowedVariables.push(value)
  variableInput.value = ''
  errors.value = { ...errors.value, variables: '' }
}
const validate = () => {
  const next: Record<string, string> = {}
  if (!keyPattern.test(draft.key.trim()))
    next.key = 'key 需以小写字母开头，仅可使用小写字母、数字、点和横线'
  if (!draft.name.trim()) next.name = '请输入模板名称'
  if (!draft.subject.trim()) next.subject = '请输入 Email Subject'
  else if (draft.subject.length > 255) next.subject = 'Subject 最多 255 个字符'
  if (!draft.text.trim()) next.text = '请输入纯文本正文'
  const declared = new Set(draft.allowedVariables)
  const content = [draft.subject, draft.text, draft.html ?? ''].join('\n')
  const referenced = new Set([...content.matchAll(tokenPattern)].map((match) => match[1]))
  const malformed =
    content.replace(tokenPattern, '').includes('{{') ||
    content.replace(tokenPattern, '').includes('}}')
  const unknown = [...referenced].filter((name) => !declared.has(name))
  if (malformed) next.text = '模板变量语法不完整'
  else if (unknown.length) next.text = `未声明变量：${unknown.join('、')}`
  errors.value = next
  return !Object.keys(next).length
}
const submit = () => {
  if (!validate()) return
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
  <UiDialog
    v-model:open="visible"
    :title="template ? '编辑消息模板' : '新建消息模板'"
    description="变量必须先声明，再以双花括号写入正文。"
    class="max-w-3xl"
    ><form class="grid gap-4" @submit.prevent="submit">
      <div class="grid gap-4 md:grid-cols-2">
        <UiField label="模板 key" for="notification-template-key" :error="errors.key"
          ><UiInput
            id="notification-template-key"
            v-model="draft.key"
            :disabled="Boolean(template)"
            :invalid="Boolean(errors.key)"
            :aria-describedby="errors.key ? 'notification-template-key-error' : undefined"
            placeholder="account.verify-email" /></UiField
        ><UiField label="模板名称" for="notification-template-name" :error="errors.name"
          ><UiInput
            id="notification-template-name"
            v-model="draft.name"
            :invalid="Boolean(errors.name)"
            :aria-describedby="errors.name ? 'notification-template-name-error' : undefined"
        /></UiField>
      </div>
      <UiField
        label="允许变量"
        for="notification-template-variable"
        :error="errors.variables"
        hint="正文中仅可使用这里声明的 {{variable}} 变量。"
        ><div class="grid gap-2">
          <div class="flex gap-2">
            <UiInput
              id="notification-template-variable"
              v-model="variableInput"
              placeholder="例如 userName"
              @keydown.enter.prevent="addVariable"
            /><UiButton
              type="button"
              variant="outline"
              size="icon"
              aria-label="添加变量"
              @click="addVariable"
              ><Plus
            /></UiButton>
          </div>
          <div class="flex flex-wrap gap-2">
            <UiBadge v-for="variable in draft.allowedVariables" :key="variable" variant="secondary"
              >{{ variable
              }}<button
                type="button"
                class="rounded-sm p-0.5 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                :aria-label="`删除变量 ${variable}`"
                @click="
                  draft.allowedVariables = draft.allowedVariables.filter(
                    (item) => item !== variable
                  )
                "
              >
                <X class="size-3" /></button
            ></UiBadge>
          </div></div></UiField
      ><UiField label="Email Subject" for="notification-template-subject" :error="errors.subject"
        ><UiInput
          id="notification-template-subject"
          v-model="draft.subject"
          maxlength="255"
          :invalid="Boolean(errors.subject)"
          :aria-describedby="
            errors.subject ? 'notification-template-subject-error' : undefined
          " /></UiField
      ><UiField label="纯文本正文" for="notification-template-text" :error="errors.text"
        ><UiTextarea
          id="notification-template-text"
          v-model="draft.text"
          rows="6"
          maxlength="102400"
          :invalid="Boolean(errors.text)"
          :aria-describedby="
            errors.text ? 'notification-template-text-error' : undefined
          " /></UiField
      ><UiField label="HTML 正文（可选，仅源码）" for="notification-template-html"
        ><UiTextarea
          id="notification-template-html"
          v-model="draft.html"
          rows="6"
          maxlength="204800"
      /></UiField>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <label v-if="!template" class="flex items-center gap-2 text-sm"
          ><input
            v-model="draft.enabled"
            type="checkbox"
            class="size-4 rounded accent-foreground"
          />保存后启用</label
        >
        <p v-else class="text-sm text-muted-foreground">启用状态请在模板列表中单独修改。</p>
        <div class="flex gap-2">
          <UiButton type="button" variant="outline" @click="visible = false">取消</UiButton
          ><UiButton type="submit" :loading="loading">保存模板</UiButton>
        </div>
      </div>
    </form></UiDialog
  >
</template>
