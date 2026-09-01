<script setup lang="ts">
import UiCard from '@/components/ui/ui-card.vue'

defineOptions({ name: 'UserStatisticCard' })
defineProps<{
  title: string
  value: number
}>()
</script>

<template>
  <UiCard class="h-full overflow-hidden shadow-none" :aria-label="`${title}：${value}`">
    <div class="grid gap-5">
      <p class="text-sm font-medium text-muted-foreground">{{ title }}</p>
      <p class="text-3xl font-semibold tracking-tight tabular-nums">
        {{ value.toLocaleString('zh-CN') }}
      </p>
    </div>
  </UiCard>
</template>
