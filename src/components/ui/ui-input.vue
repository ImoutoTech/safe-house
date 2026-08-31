<script setup lang="ts">
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiInput', inheritAttrs: false })
const model = defineModel<string | number | null>({ default: '' })
defineProps<{ class?: string; invalid?: boolean }>()
</script>

<template>
  <input
    v-model="model"
    v-bind="$attrs"
    :aria-invalid="invalid || undefined"
    :class="
      cn(
        'flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm',
        $props.class
      )
    "
  />
</template>
