<script setup lang="ts">
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiBadge' })
const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success'
    class?: string
  }>(),
  { variant: 'default' }
)
</script>

<template>
  <span
    :class="
      cn(
        'inline-flex w-fit shrink-0 items-center gap-1 overflow-hidden rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap focus-visible:ring-[3px] focus-visible:ring-ring/50',
        {
          'border-transparent bg-primary text-primary-foreground': props.variant === 'default',
          'border-transparent bg-secondary text-secondary-foreground':
            props.variant === 'secondary',
          'text-foreground': props.variant === 'outline',
          'border-transparent bg-destructive text-white': props.variant === 'destructive',
          'border-transparent bg-emerald-100 text-emerald-800': props.variant === 'success'
        },
        props.class
      )
    "
    ><slot
  /></span>
</template>
