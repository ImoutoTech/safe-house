<script setup lang="ts">
import UiBadge from '@/components/ui/ui-badge.vue'
import { UserRole } from '@reus-able/types'
import { ROLE_NAME_MAP } from '@/utils/constants'

defineOptions({ name: 'UserRoleTag' })
defineProps<{ role: UserRole }>()
</script>

<template>
  <UiBadge :variant="role === UserRole.ADMIN ? 'success' : 'secondary'">{{
    ROLE_NAME_MAP[role]
  }}</UiBadge>
</template>
