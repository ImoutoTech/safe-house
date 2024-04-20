<template>
  <n-tag :type="STATUS_TYPE_MAP[status]" :bordered="false" :size="size">
    {{ STATUS_NAME_MAP[status] }}
  </n-tag>
</template>
<script setup lang="ts">
import { AppStatus } from '@/types'
import { STATUS_NAME_MAP } from '@/utils/constants'

defineOptions({
  name: 'AppStatus'
})

withDefaults(
  defineProps<{
    status: AppStatus
    size?: 'small' | 'medium' | 'large' | 'tiny'
  }>(),
  {
    size: 'small'
  }
)

const STATUS_TYPE_MAP = {
  [AppStatus.BANNED]: 'error' as const,
  [AppStatus.CLOSED]: undefined,
  [AppStatus.RUNNING]: 'info' as const
}
</script>
