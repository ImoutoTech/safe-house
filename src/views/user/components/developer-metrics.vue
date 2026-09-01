<script setup lang="ts">
import EmptyState from '@/components/patterns/empty-state.vue'
import UiButton from '@/components/ui/ui-button.vue'
import type { UserOverviewApps } from '@/types'
import UserStatisticCard from './user-statistic-card.vue'

defineOptions({ name: 'DeveloperMetrics' })
const props = defineProps<{
  apps: UserOverviewApps
  windowDays: number
}>()
const emit = defineEmits<{
  (event: 'manage-apps'): void
}>()

interface MetricItem {
  key: string
  title: string
  value: number
}

const metrics = computed<MetricItem[]>(() => [
  {
    key: 'apps',
    title: '子应用总数',
    value: props.apps.total
  },
  {
    key: 'login',
    title: `近 ${props.windowDays} 天成功登录`,
    value: props.apps.loginSucceeded
  },
  {
    key: 'approved',
    title: `近 ${props.windowDays} 天授权同意`,
    value: props.apps.consentApproved
  },
  {
    key: 'denied',
    title: `近 ${props.windowDays} 天授权拒绝`,
    value: props.apps.consentDenied
  }
])
</script>

<template>
  <section class="grid gap-4" aria-labelledby="developer-metrics-title">
    <div class="grid gap-1">
      <h2 id="developer-metrics-title" class="text-lg font-semibold">我的子应用</h2>
      <p class="text-sm text-muted-foreground">登录和授权指标统计最近 {{ windowDays }} 天。</p>
    </div>
    <EmptyState
      v-if="apps.total === 0"
      title="还没有子应用"
      description="创建第一个子应用后，这里会展示真实的登录和授权指标。"
    >
      <template #action>
        <UiButton variant="outline" size="sm" @click="emit('manage-apps')">管理子应用</UiButton>
      </template>
    </EmptyState>
    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <UserStatisticCard
        v-for="metric in metrics"
        :key="metric.key"
        :title="metric.title"
        :value="metric.value"
      />
    </div>
  </section>
</template>
