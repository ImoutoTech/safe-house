<script setup lang="ts" generic="T extends string | number">
import { RadioGroupItem } from 'reka-ui'
import { cn } from '@/lib/utils'
import UiRadioGroup from './ui-radio-group.vue'

defineOptions({ name: 'UiRadioCards' })
const model = defineModel<T>({ required: true })
const props = defineProps<{
  items: { value: T; label: string; disabled?: boolean }[]
  legend?: string
  class?: string
}>()
</script>

<template>
  <div class="grid gap-2">
    <div v-if="legend" class="text-sm font-medium leading-none">{{ legend }}</div>
    <UiRadioGroup
      v-model="model"
      :aria-label="legend"
      :class="cn('grid grid-cols-2 gap-2', props.class)"
    >
      <label
        v-for="item in items"
        :key="String(item.value)"
        class="relative flex cursor-pointer items-center justify-center rounded-md border border-input px-2 py-3 text-center shadow-xs outline-none transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50 has-data-[state=checked]:border-primary/50"
        :data-disabled="item.disabled || undefined"
      >
        <RadioGroupItem
          type="button"
          :value="item.value"
          class="sr-only after:absolute after:inset-0"
          :disabled="item.disabled"
        />
        <span class="text-sm font-medium leading-none text-foreground">{{ item.label }}</span>
      </label>
    </UiRadioGroup>
  </div>
</template>
