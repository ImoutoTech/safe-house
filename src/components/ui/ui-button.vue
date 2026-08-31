<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { LoaderCircle } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiButton', inheritAttrs: false })
const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive'
    size?: 'default' | 'sm' | 'lg' | 'icon'
    loading?: boolean
    block?: boolean
    as?: 'button' | 'a'
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    class?: string
  }>(),
  {
    variant: 'default',
    size: 'default',
    loading: false,
    block: false,
    as: 'button',
    type: 'button',
    disabled: false
  }
)
const attrs = useAttrs()
const classes = computed(() =>
  cn(
    'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4',
    {
      'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90':
        props.variant === 'default',
      'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80':
        props.variant === 'secondary',
      'border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground':
        props.variant === 'outline',
      'hover:bg-accent hover:text-accent-foreground': props.variant === 'ghost',
      'text-primary underline-offset-4 hover:underline': props.variant === 'link',
      'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/30':
        props.variant === 'destructive',
      'h-9 px-4 py-2': props.size === 'default',
      'h-8 rounded-md px-3 text-xs': props.size === 'sm',
      'h-10 rounded-md px-6': props.size === 'lg',
      'size-9 p-0': props.size === 'icon',
      'w-full': props.block
    },
    props.class
  )
)
</script>

<template>
  <component
    :is="as"
    v-bind="attrs"
    :class="classes"
    :type="as === 'button' ? type : undefined"
    :disabled="as === 'button' ? loading || disabled : undefined"
    :aria-disabled="as === 'a' && (loading || disabled) ? 'true' : undefined"
    :aria-busy="loading || undefined"
  >
    <LoaderCircle v-if="loading" class="animate-spin" aria-hidden="true" />
    <slot />
  </component>
</template>
