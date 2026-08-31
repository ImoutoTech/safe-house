<script setup lang="ts">
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiTextarea', inheritAttrs: false })
const model = defineModel<string | null>({ default: '' })
defineProps<{ class?: string; invalid?: boolean }>()
</script>

<template>
  <textarea
    v-model="model"
    v-bind="$attrs"
    :aria-invalid="invalid || undefined"
    :class="
      cn(
        'flex min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20',
        $props.class
      )
    "
  />
</template>
