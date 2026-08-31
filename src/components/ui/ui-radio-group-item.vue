<script setup lang="ts">
import { CircleIcon } from 'lucide-vue-next'
import { RadioGroupIndicator, RadioGroupItem } from 'reka-ui'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiRadioGroupItem' })
const props = defineProps<{ class?: string; value: string | number; disabled?: boolean }>()
</script>

<template>
  <RadioGroupItem
    type="button"
    :value="props.value"
    :disabled="props.disabled"
    :class="
      cn(
        'aspect-square size-4 shrink-0 rounded-full border border-input text-primary shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50',
        props.class
      )
    "
  >
    <RadioGroupIndicator class="relative flex items-center justify-center">
      <CircleIcon
        class="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 fill-primary"
      />
    </RadioGroupIndicator>
  </RadioGroupItem>
</template>
