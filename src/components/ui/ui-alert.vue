<script setup lang="ts">
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-vue-next'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiAlert' })
const props = withDefaults(
  defineProps<{
    variant?: 'info' | 'success' | 'warning' | 'destructive'
    title?: string
    class?: string
  }>(),
  { variant: 'info' }
)
const icon = computed(
  () =>
    ({ info: Info, success: CheckCircle2, warning: TriangleAlert, destructive: AlertCircle })[
      props.variant
    ]
)
</script>

<template>
  <div
    :class="
      cn(
        'grid grid-cols-[auto_1fr] gap-x-3 rounded-lg border p-4 text-sm',
        {
          'border-border bg-muted/40 text-foreground': variant === 'info',
          'border-emerald-200 bg-emerald-50 text-emerald-950': variant === 'success',
          'border-amber-200 bg-amber-50 text-amber-950': variant === 'warning',
          'border-destructive/30 bg-destructive/5 text-destructive': variant === 'destructive'
        },
        $props.class
      )
    "
    :role="variant === 'destructive' ? 'alert' : 'status'"
  >
    <component :is="icon" class="mt-0.5 size-4" aria-hidden="true" />
    <div class="grid gap-1">
      <strong v-if="title" class="font-medium leading-none">{{ title }}</strong>
      <div class="leading-relaxed"><slot /></div>
    </div>
  </div>
</template>
