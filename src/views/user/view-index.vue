<script setup lang="ts">
import UiAvatar from '@/components/ui/ui-avatar.vue'
import UiBadge from '@/components/ui/ui-badge.vue'
import UiTabs from '@/components/ui/ui-tabs.vue'
import UiTabsList from '@/components/ui/ui-tabs-list.vue'
import UiTabsTrigger from '@/components/ui/ui-tabs-trigger.vue'
import UserRoleTag from '@/components/user-role-tag.vue'
import { useUserData } from '@/composables/useUserData'
import { userRoutes } from '@/router/user-routes'
import { UserRole } from '@reus-able/types'

defineOptions({ name: 'UserIndex' })
const route = useRoute()
const router = useRouter()
const { userData, userPermissions } = useUserData(true)
const activeTab = computed({
  get: () => String(route.name ?? ''),
  set: (name: string | number) => {
    const next = String(name)
    if (next && next !== String(route.name ?? '')) void router.push({ name: next })
  }
})
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
    <header class="flex w-full flex-wrap items-center gap-4 pb-6">
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
    <UiTabs v-model="activeTab" class="mb-6 items-start" activation-mode="manual">
      <UiTabsList
        class="h-auto max-w-full overflow-x-auto bg-transparent p-1.5"
        aria-label="账号设置"
      >
        <UiTabsTrigger
          v-for="item in tabList"
          :key="item.value"
          :value="item.value"
          class="shrink-0 data-[state=active]:bg-muted data-[state=active]:shadow-none"
        >
          {{ item.name }}
        </UiTabsTrigger>
      </UiTabsList>
    </UiTabs>
    <router-view />
  </div>
</template>
