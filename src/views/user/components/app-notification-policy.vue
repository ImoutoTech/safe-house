<script setup lang="ts">
import type {
  AppNotificationPolicy,
  AppNotificationPolicyUpdate,
  NotificationAdminApp,
  NotificationTemplateOption
} from '@/types'

defineOptions({ name: 'AppNotificationPolicy' })

const props = defineProps<{
  apps: NotificationAdminApp[]
  templates: NotificationTemplateOption[]
  policy?: AppNotificationPolicy
  selectedAppId: string
  loading: boolean
  error?: Error
}>()
const emit = defineEmits<{
  select: [appId: string]
  save: [draft: AppNotificationPolicyUpdate]
  retry: []
}>()

const draft = reactive<AppNotificationPolicyUpdate>({
  directContent: false,
  manualRecipient: false,
  templateIds: []
})
const appOptions = computed(() => props.apps.map((app) => ({ label: app.name, value: app.id })))
const templateOptions = computed(() =>
  props.templates.map((template) => ({
    label: `${template.name} (${template.key})${template.enabled ? '' : ' · 已停用'}`,
    value: template.id
  }))
)
const isCurrentPolicy = computed(() => props.policy?.appId === props.selectedAppId)

watch(
  [() => props.selectedAppId, () => props.policy],
  ([appId, policy]) => {
    const current = policy?.appId === appId ? policy : undefined
    draft.directContent = current?.directContent ?? false
    draft.manualRecipient = current?.manualRecipient ?? false
    draft.templateIds = [...(current?.templateIds ?? [])]
  },
  { immediate: true }
)

const submit = () => {
  emit('save', {
    directContent: draft.directContent,
    manualRecipient: draft.manualRecipient,
    templateIds: [...draft.templateIds]
  })
}
</script>

<template>
  <section class="policy-form">
    <n-alert type="warning" :bordered="false">
      直接内容与手动收件地址是高风险能力。策略收紧后，该应用的所有现有通知 Key 会立即受限。
    </n-alert>
    <n-form class="policy-form__body" label-placement="top">
      <n-form-item label="子应用">
        <n-select
          :value="selectedAppId || null"
          filterable
          :options="appOptions"
          :disabled="loading"
          placeholder="选择要配置的子应用"
          @update:value="emit('select', $event)"
        />
      </n-form-item>
      <n-alert v-if="error" type="error" title="应用通知权限加载失败">
        <n-button size="small" @click="emit('retry')">重试</n-button>
      </n-alert>
      <template v-if="selectedAppId">
        <n-form-item label="允许模板">
          <n-select
            v-model:value="draft.templateIds"
            multiple
            filterable
            clearable
            :options="templateOptions"
            :disabled="loading || !isCurrentPolicy"
            placeholder="默认不允许任何模板"
          />
        </n-form-item>
        <n-grid cols="1 768:2" :x-gap="16">
          <n-form-item-gi label="直接内容">
            <n-switch
              v-model:value="draft.directContent"
              :disabled="loading || !isCurrentPolicy"
              aria-label="允许直接内容"
            />
            <n-text class="policy-form__hint" depth="3"
              >允许应用自行提交 subject/text/html。</n-text
            >
          </n-form-item-gi>
          <n-form-item-gi label="手动收件人">
            <n-switch
              v-model:value="draft.manualRecipient"
              :disabled="loading || !isCurrentPolicy"
              aria-label="允许手动收件人"
            />
            <n-text class="policy-form__hint" depth="3">允许应用向非 H 用户 Email 发送。</n-text>
          </n-form-item-gi>
        </n-grid>
        <n-flex justify="end">
          <n-button type="primary" :loading="loading" :disabled="!isCurrentPolicy" @click="submit">
            保存应用通知权限
          </n-button>
        </n-flex>
      </template>
      <n-empty v-else description="请先选择子应用" />
    </n-form>
  </section>
</template>

<style scoped lang="scss">
.policy-form__body {
  margin-top: 18px;
}

.policy-form__hint {
  display: block;
  margin-top: 8px;
}
</style>
