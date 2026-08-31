<script setup lang="ts">
import { KeyRound } from 'lucide-vue-next'
import UiCard from '@/components/ui/ui-card.vue'

defineOptions({ name: 'AuthPanel' })
defineProps<{ title: string; description: string }>()
</script>

<template>
  <UiCard class="w-full max-w-sm">
    <template #header>
      <div class="grid w-full justify-items-center gap-3 text-center">
        <span class="flex size-11 items-center justify-center rounded-xl border bg-muted/60"
          ><KeyRound class="size-5" aria-hidden="true"
        /></span>
        <div class="grid gap-1.5">
          <h1 class="text-xl font-semibold tracking-tight">{{ title }}</h1>
          <p class="text-sm leading-relaxed text-muted-foreground">{{ description }}</p>
        </div>
      </div>
    </template>
    <slot />
  </UiCard>
</template>
