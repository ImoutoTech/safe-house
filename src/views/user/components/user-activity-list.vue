<script setup lang="ts">
import dayjs from 'dayjs'
import { AppWindow, KeyRound, LogIn, ShieldCheck, UserRound } from 'lucide-vue-next'
import type { Component } from 'vue'
import EmptyState from '@/components/patterns/empty-state.vue'
import UiAlert from '@/components/ui/ui-alert.vue'
import UiBadge from '@/components/ui/ui-badge.vue'
import UiButton from '@/components/ui/ui-button.vue'
import UiSpinner from '@/components/ui/ui-spinner.vue'
import type { UserActivityCategory, UserActivityItem, UserActivityOutcome } from '@/types'

defineOptions({ name: 'UserActivityList' })
withDefaults(
  defineProps<{
    items: readonly UserActivityItem[]
    loading?: boolean
    error?: Error
    hasMore?: boolean
  }>(),
  { loading: false, error: undefined, hasMore: false }
)
const emit = defineEmits<{
  (event: 'load-more'): void
  (event: 'retry'): void
}>()

const categoryIcons: Record<UserActivityCategory, Component> = {
  account: UserRound,
  identity: KeyRound,
  oidc: LogIn,
  subapp: AppWindow
}
const outcomeLabels: Record<UserActivityOutcome, string> = {
  success: '已成功',
  failure: '失败',
  approved: '已同意',
  denied: '已拒绝'
}
const outcomeVariants: Record<
  UserActivityOutcome,
  'success' | 'destructive' | 'secondary' | 'outline'
> = {
  success: 'success',
  failure: 'destructive',
  approved: 'success',
  denied: 'outline'
}
const absoluteTime = (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss')
const relativeTime = (value: string) => dayjs(value).fromNow()
const targetLabel = (item: UserActivityItem) =>
  item.target ? `${item.target.type === 'subapp' ? '子应用' : '登录方式'}：${item.target.name}` : ''
</script>

<template>
  <section class="grid gap-4" aria-labelledby="user-activity-title">
    <div class="grid gap-1">
      <h2 id="user-activity-title" class="text-lg font-semibold">最近活动</h2>
      <p class="text-sm text-muted-foreground">
        仅展示当前账号自己的登录、资料、登录方式和子应用相关操作。
      </p>
    </div>

    <div v-if="loading && !items.length" class="py-8 text-center">
      <UiSpinner label="正在读取最近活动" />
    </div>
    <UiAlert v-else-if="error && !items.length" variant="destructive" title="活动加载失败">
      <div class="grid justify-items-start gap-3">
        <span>{{ error.message }}</span>
        <UiButton variant="outline" size="sm" :loading="loading" @click="emit('retry')">
          重试
        </UiButton>
      </div>
    </UiAlert>
    <EmptyState
      v-else-if="!items.length"
      title="暂无最近活动"
      description="后续的账号和子应用操作会显示在这里。"
    />
    <ol v-else class="divide-y rounded-xl border bg-card">
      <li v-for="item in items" :key="item.id" class="flex gap-3 p-4 sm:gap-4 sm:p-5">
        <span
          class="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border bg-muted text-muted-foreground"
          aria-hidden="true"
        >
          <component :is="categoryIcons[item.category] || ShieldCheck" class="size-4" />
        </span>
        <div class="grid min-w-0 flex-1 gap-1.5">
          <div class="flex flex-wrap items-center gap-2">
            <strong class="text-sm font-medium">{{ item.summary }}</strong>
            <UiBadge :variant="outcomeVariants[item.outcome]">
              {{ outcomeLabels[item.outcome] }}
            </UiBadge>
          </div>
          <p v-if="item.detail" class="text-sm text-muted-foreground">{{ item.detail }}</p>
          <p v-if="item.target" class="truncate text-sm text-muted-foreground">
            {{ targetLabel(item) }}
          </p>
          <time
            :datetime="item.occurredAt"
            :title="absoluteTime(item.occurredAt)"
            class="text-xs text-muted-foreground"
          >
            {{ relativeTime(item.occurredAt) }} · {{ absoluteTime(item.occurredAt) }}
          </time>
        </div>
      </li>
    </ol>

    <UiAlert v-if="error && items.length" variant="warning" title="更多活动加载失败">
      <div class="grid justify-items-start gap-3">
        <span>{{ error.message }}</span>
        <UiButton variant="outline" size="sm" :loading="loading" @click="emit('retry')">
          重试
        </UiButton>
      </div>
    </UiAlert>
    <div v-if="hasMore && !error" class="flex justify-center">
      <UiButton variant="outline" :loading="loading" @click="emit('load-more')">
        加载更多
      </UiButton>
    </div>
  </section>
</template>
