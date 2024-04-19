<template>
  <n-tag :type="ROLE_TYPE_MAP[role]" :size="size" :bordered="false">
    {{ ROLE_NAME_MAP[role] }}
  </n-tag>
</template>
<script setup lang="ts">
import { UserRole } from '@reus-able/types'
import { ROLE_NAME_MAP } from '@/utils/constants'

defineOptions({
  name: 'UserRoleTag'
})

withDefaults(
  defineProps<{
    role: UserRole
    size?: 'small' | 'medium' | 'large' | 'tiny'
  }>(),
  {
    size: 'small'
  }
)

const ROLE_TYPE_MAP = {
  [UserRole.USER]: 'warning' as const,
  [UserRole.ADMIN]: 'success' as const
}
</script>
