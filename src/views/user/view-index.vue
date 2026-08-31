<script setup lang="ts">
import UiAvatar from '@/components/ui/ui-avatar.vue'
import UiBadge from '@/components/ui/ui-badge.vue'
import UserRoleTag from '@/components/user-role-tag.vue'
import { useUserData } from '@/composables/useUserData'
import { userRoutes } from '@/router/user-routes'
import { UserRole } from '@reus-able/types'

defineOptions({ name: 'UserIndex' })
const route = useRoute()
const router = useRouter()
const { userData, userPermissions } = useUserData(true)
const tabList = computed(() =>
  userRoutes
    .filter((item) => {
      if (!item.meta?.hideTabWithoutPermission || userData.value.role === UserRole.ADMIN)
        return true
      if (typeof item.meta.permission === 'string')
        return userPermissions.value.includes(item.meta.permission)
      return (
        Array.isArray(item.meta.permissions) &&
        item.meta.permissions.some(
          (permission) =>
            typeof permission === 'string' && userPermissions.value.includes(permission)
        )
      )
    })
    .map((item) => ({ name: item.meta?.title || '', value: item.name as string }))
)
</script>

<template>
  <div class="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
    <header class="flex w-full flex-wrap items-center gap-4 border-b pb-6">
      <UiAvatar
        :src="userData.avatar"
        :alt="userData.nickname"
        :fallback="userData.nickname.slice(0, 1)"
        size="lg"
      />
      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-2">
          <h1 class="truncate text-xl font-semibold">{{ userData.nickname }}</h1>
          <UiBadge variant="outline">#{{ userData.id }}</UiBadge>
        </div>
        <div class="mt-2"><UserRoleTag :role="userData.role" /></div>
      </div>
    </header>
    <nav class="mb-6 flex gap-1 overflow-x-auto border-b" aria-label="账号设置">
      <button
        v-for="item in tabList"
        :key="item.value"
        :class="[
          'shrink-0 border-b-2 px-3 py-3 text-sm font-medium outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50',
          route.name === item.value
            ? 'border-foreground text-foreground'
            : 'border-transparent text-muted-foreground hover:text-foreground'
        ]"
        @click="router.push({ name: item.value })"
      >
        {{ item.name }}
      </button>
    </nav>
    <router-view />
  </div>
</template>
