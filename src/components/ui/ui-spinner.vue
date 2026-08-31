<script setup lang="ts">
import { LoaderCircle } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiSpinner' })
withDefaults(defineProps<{ label?: string; class?: string }>(), { label: '加载中' })
</script>

<template>
  <span
    :class="cn('inline-flex items-center gap-2 text-sm text-muted-foreground', $props.class)"
    role="status"
  >
    <LoaderCircle class="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
    <span>{{ label }}</span>
  </span>
</template>
