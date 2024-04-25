<template>
  <n-card class="app-item" :title="app.name" size="small">
    <n-flex class="app-des" align="center">
      <app-status class="app-status" :status="app.meta.status"></app-status>
      <n-text depth="3">
        {{ app.description || '暂无介绍' }}
      </n-text>
    </n-flex>
    <n-flex justify="space-between" align="center">
      <span>
        回调地址 <n-text type="info"> {{ app.callback }} </n-text>
      </span>
      <n-text depth="3" size="small" :bordered="false">已访问 {{ app.visitNum }} 次</n-text>
    </n-flex>
    <template #action>
      <n-flex justify="space-between" align="center">
        <n-text depth="3">
          创建于 {{ dayjs(app.created_at).format('YYYY-MM-DD') }} | 最后编辑于
          {{ dayjs(app.updated_at).fromNow() }}
        </n-text>

        <n-flex>
          <n-button size="small" tertiary @click="emit('inspect')">秘钥</n-button>
          <n-button size="small" tertiary @click="emit('update')">编辑</n-button>
          <n-button size="small" type="error" tertiary @click="submit">删除</n-button>
        </n-flex>
      </n-flex>
    </template>

    <template #header-extra>
      <div class="app-header-btn">
        <n-tooltip :show-arrow="false">
          <template #trigger>
            <n-button size="tiny" text @click="copyId">
              <template #icon>
                <n-icon :component="CopyOutline" />
              </template>
              复制ID
            </n-button>
          </template>
          {{ app.id }}
        </n-tooltip>
      </div>
    </template>
  </n-card>
</template>
<script setup lang="ts">
import { useDeleteApp } from '@/composables/useDeleteApp'
import { CopyOutline } from '@vicons/ionicons5'
import { useClipboard } from '@vueuse/core'
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
  (e: 'update'): void
  (e: 'inspect'): void
}>()

const { submit } = useDeleteApp(props.app, () => emit('delete'))
const { copy } = useClipboard()
const msg = useMessage()

const copyId = async () => {
  await copy(props.app.id)
  msg.success('复制成功')
}
</script>
<style lang="scss" scoped>
.app-item {
  .app-header-btn {
    opacity: 0;
    transition: opacity 0.1s ease-in-out;
  }

  &:hover {
    .app-header-btn {
      opacity: 1;
    }
  }

  .app-des {
    margin-bottom: 16px;
  }
}
</style>
