<script setup lang="ts">
import { RadioGroupRoot } from 'reka-ui'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiRadioGroup' })
const model = defineModel<string | number>({ default: '' })
defineProps<{ class?: string }>()
</script>

<template>
  <RadioGroupRoot v-model="model" v-bind="$attrs" :class="cn('grid gap-3', $props.class)">
    <slot />
  </RadioGroupRoot>
</template>
