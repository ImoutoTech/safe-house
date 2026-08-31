<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'UiField' })
const props = defineProps<{ label: string; for?: string; error?: string; hint?: string }>()
const hintId = computed(() => (props.for ? `${props.for}-hint` : undefined))
const errorId = computed(() => (props.for ? `${props.for}-error` : undefined))
</script>

<template>
  <div class="grid gap-2">
    <component
      :is="props.for ? 'label' : 'div'"
      :for="props.for"
      class="text-sm font-medium leading-none"
      >{{ label }}</component
    >
    <slot :described-by="error ? errorId : hint ? hintId : undefined" :invalid="Boolean(error)" />
    <p v-if="error" :id="errorId" class="text-sm text-destructive" role="alert">{{ error }}</p>
    <p v-else-if="hint" :id="hintId" class="text-xs leading-relaxed text-muted-foreground">
      {{ hint }}
    </p>
  </div>
</template>
