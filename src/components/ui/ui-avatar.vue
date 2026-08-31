<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiAvatar' })
const props = withDefaults(
  defineProps<{
    src?: string
    alt?: string
    fallback: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    class?: string
  }>(),
  { alt: '', size: 'md' }
)
const sizeClass = computed(
  () =>
    ({
      sm: 'size-8 text-xs',
      md: 'size-10 text-sm',
      lg: 'size-16 text-xl',
      xl: 'size-24 text-2xl'
    })[props.size]
)
</script>

<template>
  <span
    :class="
      cn(
        'relative inline-flex shrink-0 overflow-hidden rounded-full border bg-muted',
        sizeClass,
        props.class
      )
    "
  >
    <img v-if="src" :src="src" :alt="alt" class="aspect-square size-full object-cover" />
    <span
      v-else
      class="flex size-full items-center justify-center font-medium text-muted-foreground"
      >{{ fallback }}</span
    >
  </span>
</template>
