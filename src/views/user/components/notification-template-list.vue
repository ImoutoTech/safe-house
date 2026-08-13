<script setup lang="ts">
import type { NotificationTemplate } from '@/types'

defineOptions({ name: 'NotificationTemplateList' })

defineProps<{
  templates: NotificationTemplate[]
  loading: boolean
  error?: Error
}>()
const emit = defineEmits<{
  create: []
  edit: [template: NotificationTemplate]
  toggle: [template: NotificationTemplate, enabled: boolean]
  retry: []
}>()
</script>

<template>
  <section class="template-list">
    <n-flex justify="space-between" align="center">
      <n-text depth="3">模板 key 创建后不可修改；HTML 仅以源码编辑，不在此处渲染。</n-text>
      <n-button type="primary" secondary :disabled="loading" @click="emit('create')">
        新建模板
      </n-button>
    </n-flex>
    <n-alert v-if="error" class="template-list__alert" type="error" title="消息模板加载失败">
      <n-button size="small" :disabled="loading" @click="emit('retry')">重试</n-button>
    </n-alert>
    <n-spin :show="loading">
      <n-list class="template-list__body" bordered hoverable>
        <n-list-item v-for="template in templates" :key="template.id">
          <n-thing :title="template.name">
            <template #description>
              <n-flex align="center">
                <n-code :code="template.key" language="text" />
                <n-tag size="small" :type="template.enabled ? 'success' : 'default'">
                  {{ template.enabled ? '已启用' : '已停用' }}
                </n-tag>
              </n-flex>
            </template>
            <n-text depth="3">{{ template.subject }}</n-text>
            <template #footer>
              <n-text depth="3" size="small">
                变量：{{ template.allowedVariables.join('、') || '无' }}
              </n-text>
            </template>
          </n-thing>
          <template #suffix>
            <n-flex align="center" :wrap="false">
              <n-switch
                :value="template.enabled"
                size="small"
                :disabled="loading"
                :aria-label="`${template.name}启用状态`"
                @update:value="emit('toggle', template, $event)"
              />
              <n-button size="small" tertiary :disabled="loading" @click="emit('edit', template)">
                编辑
              </n-button>
            </n-flex>
          </template>
        </n-list-item>
        <n-empty v-if="!templates.length && !error" class="template-list__empty">
          暂无消息模板
        </n-empty>
      </n-list>
    </n-spin>
  </section>
</template>

<style scoped lang="scss">
.template-list__alert,
.template-list__body {
  margin-top: 16px;
}

.template-list__empty {
  margin: 28px 0;
}

@media (max-width: 768px) {
  .template-list :deep(.n-list-item) {
    align-items: flex-start;
  }
}
</style>
