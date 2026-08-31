<script setup lang="ts">
import UiCard from '@/components/ui/ui-card.vue'

defineOptions({ name: 'AuthPanel' })
defineProps<{ title: string; description: string }>()
</script>

<template>
  <UiCard class="w-full max-w-sm">
    <template #header>
      <div class="grid w-full justify-items-center gap-1.5 text-center">
        <h1 class="text-xl font-semibold tracking-tight">{{ title }}</h1>
        <p class="text-sm leading-relaxed text-muted-foreground">{{ description }}</p>
      </div>
    </template>
    <slot />
  </UiCard>
</template>
