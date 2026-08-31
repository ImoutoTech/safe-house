<script setup lang="ts">
import EmptyState from '@/components/patterns/empty-state.vue'
import UiAlert from '@/components/ui/ui-alert.vue'
import UiButton from '@/components/ui/ui-button.vue'
import UiField from '@/components/ui/ui-field.vue'
import UiSwitch from '@/components/ui/ui-switch.vue'
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
const submit = () =>
  emit('save', {
    directContent: draft.directContent,
    manualRecipient: draft.manualRecipient,
    templateIds: [...draft.templateIds]
  })
</script>

<template>
  <div class="grid gap-5">
    <UiAlert variant="warning"
      >直接内容与手动收件地址是高风险能力。策略收紧后，该应用的所有现有通知 Key
      会立即受限。</UiAlert
    ><UiField label="子应用" for="notification-policy-app"
      ><select
        id="notification-policy-app"
        :value="selectedAppId"
        class="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        :disabled="loading"
        @change="emit('select', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">选择要配置的子应用</option>
        <option v-for="app in apps" :key="app.id" :value="app.id">{{ app.name }}</option>
      </select></UiField
    ><UiAlert v-if="error" variant="destructive" title="应用通知权限加载失败"
      ><UiButton size="sm" variant="outline" class="mt-2" @click="emit('retry')"
        >重试</UiButton
      ></UiAlert
    >
    <form v-if="selectedAppId" class="grid gap-5" @submit.prevent="submit">
      <UiField
        label="允许模板"
        for="notification-policy-templates"
        hint="按住 Command/Ctrl 可多选；默认不允许任何模板。"
        ><select
          id="notification-policy-templates"
          v-model="draft.templateIds"
          multiple
          class="min-h-28 w-full rounded-md border bg-background p-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          :disabled="loading || !isCurrentPolicy"
        >
          <option v-for="template in templates" :key="template.id" :value="template.id">
            {{ template.name }} ({{ template.key }}){{ template.enabled ? '' : ' · 已停用' }}
          </option>
        </select></UiField
      >
      <div class="grid gap-3 md:grid-cols-2">
        <label class="flex items-start justify-between gap-4 rounded-lg border p-4"
          ><span
            ><strong class="text-sm">直接内容</strong
            ><span class="mt-1 block text-xs text-muted-foreground"
              >允许应用自行提交 subject/text/html。</span
            ></span
          ><UiSwitch
            v-model="draft.directContent"
            :disabled="loading || !isCurrentPolicy"
            aria-label="允许直接内容" /></label
        ><label class="flex items-start justify-between gap-4 rounded-lg border p-4"
          ><span
            ><strong class="text-sm">手动收件人</strong
            ><span class="mt-1 block text-xs text-muted-foreground"
              >允许向非 Safe House 用户邮箱发送。</span
            ></span
          ><UiSwitch
            v-model="draft.manualRecipient"
            :disabled="loading || !isCurrentPolicy"
            aria-label="允许手动收件人"
        /></label>
      </div>
      <UiButton
        type="submit"
        class="justify-self-end"
        :loading="loading"
        :disabled="!isCurrentPolicy"
        >保存应用通知权限</UiButton
      >
    </form>
    <EmptyState v-else title="请先选择子应用" description="选择后可查看和调整它的通知能力。" />
  </div>
</template>
