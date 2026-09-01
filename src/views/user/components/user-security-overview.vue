<script setup lang="ts">
import { KeyRound, Link2, MailCheck } from 'lucide-vue-next'
import UiBadge from '@/components/ui/ui-badge.vue'
import UiButton from '@/components/ui/ui-button.vue'
import UiCard from '@/components/ui/ui-card.vue'
import UiSpinner from '@/components/ui/ui-spinner.vue'
import type { UserOverviewAccount } from '@/types'

defineOptions({ name: 'UserSecurityOverview' })
const props = withDefaults(
  defineProps<{
    account?: UserOverviewAccount
    fallbackEmailVerified: boolean
    fallbackHasPassword: boolean
    loading?: boolean
  }>(),
  { account: undefined, loading: false }
)
const emit = defineEmits<{
  (event: 'manage-identities'): void
}>()

const emailVerified = computed(() => props.account?.emailVerified ?? props.fallbackEmailVerified)
const hasPassword = computed(() => props.account?.hasPassword ?? props.fallbackHasPassword)
const providerLabel = (provider: string) =>
  provider === 'github' ? 'GitHub' : provider === 'google' ? 'Google' : provider
</script>

<template>
  <UiCard class="flex h-full flex-col shadow-none [&>div]:flex-1">
    <template #title>账号安全</template>
    <template #description>验证状态与可用登录方式</template>
    <div class="grid gap-4">
      <div class="flex items-start gap-3">
        <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
          <MailCheck class="size-4 text-muted-foreground" aria-hidden="true" />
        </span>
        <div class="grid min-w-0 flex-1 gap-1">
          <span class="text-sm font-medium">邮箱验证</span>
          <UiBadge :variant="emailVerified ? 'success' : 'outline'">
            {{ emailVerified ? '已验证' : '未验证' }}
          </UiBadge>
        </div>
      </div>
      <div class="flex items-start gap-3">
        <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
          <KeyRound class="size-4 text-muted-foreground" aria-hidden="true" />
        </span>
        <div class="grid min-w-0 flex-1 gap-1">
          <span class="text-sm font-medium">账号密码</span>
          <UiBadge :variant="hasPassword ? 'success' : 'outline'">
            {{ hasPassword ? '已设置' : '未设置' }}
          </UiBadge>
        </div>
      </div>
      <div class="flex items-start gap-3">
        <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Link2 class="size-4 text-muted-foreground" aria-hidden="true" />
        </span>
        <div class="grid min-w-0 flex-1 gap-2">
          <span class="text-sm font-medium">外部登录方式</span>
          <UiSpinner v-if="loading && !account" label="正在读取登录方式" />
          <div v-else-if="account?.identities.length" class="flex flex-wrap gap-2">
            <UiBadge v-for="identity in account.identities" :key="identity.id" variant="secondary">
              {{ providerLabel(identity.provider) }}
            </UiBadge>
          </div>
          <p v-else-if="account" class="text-sm text-muted-foreground">尚未绑定外部登录方式</p>
          <p v-else class="text-sm text-muted-foreground">暂时无法读取绑定状态</p>
        </div>
      </div>
    </div>
    <template #footer>
      <UiButton variant="outline" size="sm" @click="emit('manage-identities')">
        管理登录方式
      </UiButton>
    </template>
  </UiCard>
</template>
