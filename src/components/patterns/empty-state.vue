<script setup lang="ts">
import { Inbox } from 'lucide-vue-next'

defineOptions({ name: 'EmptyState' })
withDefaults(defineProps<{ title: string; description?: string }>(), { description: '' })
</script>

<template>
  <div
    class="grid justify-items-center gap-3 rounded-xl border border-dashed bg-muted/20 px-6 py-10 text-center"
  >
    <span class="flex size-10 items-center justify-center rounded-lg border bg-background"
      ><Inbox class="size-5 text-muted-foreground" aria-hidden="true"
    /></span>
    <div class="grid gap-1">
      <h3 class="font-medium">{{ title }}</h3>
      <p v-if="description" class="max-w-sm text-sm text-muted-foreground">{{ description }}</p>
    </div>
    <slot name="action" />
  </div>
</template>
