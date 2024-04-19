<template>
  <n-card :title="app.name" size="small">
    <n-p depth="3">
      {{ app.description || '暂无介绍' }}
    </n-p>
    <n-flex justify="space-between" align="center">
      <span>
        回调地址 <n-text type="info"> {{ app.callback }} </n-text>
      </span>
      <n-tag size="small" :bordered="false">已访问 {{ app.visitNum }} 次</n-tag>
    </n-flex>
    <template #action>
      <n-flex justify="space-between" align="center">
        <n-text depth="3">
          创建于 {{ dayjs(app.created_at).format('YYYY-MM-DD') }} | 最后编辑于
          {{ dayjs(app.updated_at).fromNow() }}
        </n-text>

        <n-flex>
          <n-button size="small" type="error" secondary @click="submit">删除</n-button>
        </n-flex>
      </n-flex>
    </template>
  </n-card>
</template>
<script setup lang="ts">
import { useDeleteApp } from '@/composables/useDeleteApp'
import type { AppInfo } from '@/types'
import dayjs from 'dayjs'

defineOptions({
  name: 'UserAppItem'
})

const props = defineProps<{
  app: AppInfo
}>()

const emit = defineEmits<{
  (e: 'delete'): void
}>()

const { submit } = useDeleteApp(props.app, () => emit('delete'))
</script>
