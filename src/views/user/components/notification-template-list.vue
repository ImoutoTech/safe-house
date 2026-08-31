<script setup lang="ts">
import EmptyState from '@/components/patterns/empty-state.vue'
import UiAlert from '@/components/ui/ui-alert.vue'
import UiBadge from '@/components/ui/ui-badge.vue'
import UiButton from '@/components/ui/ui-button.vue'
import UiSpinner from '@/components/ui/ui-spinner.vue'
import UiSwitch from '@/components/ui/ui-switch.vue'
import type { NotificationTemplate } from '@/types'

defineOptions({ name: 'NotificationTemplateList' })
defineProps<{ templates: NotificationTemplate[]; loading: boolean; error?: Error }>()
const emit = defineEmits<{
  create: []
  edit: [template: NotificationTemplate]
  toggle: [template: NotificationTemplate, enabled: boolean]
  retry: []
}>()
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <p class="text-sm text-muted-foreground">模板 key 创建后不可修改；HTML 仅以源码编辑。</p>
      <UiButton variant="outline" :disabled="loading" @click="emit('create')">新建模板</UiButton>
    </div>
    <UiAlert v-if="error" variant="destructive" title="消息模板加载失败"
      ><UiButton size="sm" variant="outline" class="mt-2" @click="emit('retry')"
        >重试</UiButton
      ></UiAlert
    >
    <div v-if="loading && !templates.length" class="py-8 text-center"><UiSpinner /></div>
    <div v-else-if="templates.length" class="divide-y rounded-lg border">
      <article
        v-for="template in templates"
        :key="template.id"
        class="flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
      >
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <h3 class="font-medium">{{ template.name }}</h3>
            <code class="rounded bg-muted px-1.5 py-0.5 text-xs">{{ template.key }}</code
            ><UiBadge :variant="template.enabled ? 'success' : 'secondary'">{{
              template.enabled ? '已启用' : '已停用'
            }}</UiBadge>
          </div>
          <p class="mt-1 truncate text-sm text-muted-foreground">{{ template.subject }}</p>
          <p class="mt-1 text-xs text-muted-foreground">
            变量：{{ template.allowedVariables.join('、') || '无' }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <UiSwitch
            :model-value="template.enabled"
            :disabled="loading"
            :aria-label="`${template.name} 启用状态`"
            @update:model-value="emit('toggle', template, $event)"
          /><UiButton
            size="sm"
            variant="outline"
            :disabled="loading"
            @click="emit('edit', template)"
            >编辑</UiButton
          >
        </div>
      </article>
    </div>
    <EmptyState v-else title="暂无消息模板" description="新建模板后，才能授权子应用使用。" />
  </div>
</template>
