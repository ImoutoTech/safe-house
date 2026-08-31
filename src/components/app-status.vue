<script setup lang="ts">
import UiBadge from '@/components/ui/ui-badge.vue'
import { AppStatus } from '@/types'
import { STATUS_NAME_MAP } from '@/utils/constants'

defineOptions({ name: 'AppStatus' })
defineProps<{ status: AppStatus }>()
const variants = {
  [AppStatus.BANNED]: 'destructive',
  [AppStatus.CLOSED]: 'secondary',
  [AppStatus.RUNNING]: 'success'
} as const
</script>

<template>
  <UiBadge :variant="variants[status]">{{ STATUS_NAME_MAP[status] }}</UiBadge>
</template>
