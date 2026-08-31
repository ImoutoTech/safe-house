<script setup lang="ts">
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiCard' })
defineProps<{ class?: string }>()
</script>

<template>
  <div :class="cn('rounded-xl border bg-card text-card-foreground shadow-sm', $props.class)">
    <header
      v-if="$slots.header || $slots.title || $slots.description"
      class="flex items-start justify-between gap-4 p-6 pb-4"
    >
      <slot name="header">
        <div class="grid gap-1.5">
          <h2 v-if="$slots.title" class="font-semibold leading-none tracking-tight">
            <slot name="title" />
          </h2>
          <p v-if="$slots.description" class="text-sm text-muted-foreground">
            <slot name="description" />
          </p>
        </div>
      </slot>
    </header>
    <div :class="cn('p-6', ($slots.header || $slots.title || $slots.description) && 'pt-0')">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="flex items-center gap-3 border-t bg-muted/30 p-6 py-4">
      <slot name="footer" />
    </footer>
  </div>
</template>
