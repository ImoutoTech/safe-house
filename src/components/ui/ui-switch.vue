<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'reka-ui'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiSwitch' })
const model = defineModel<boolean>({ default: false })
defineProps<{ class?: string }>()
</script>

<template>
  <SwitchRoot
    v-model="model"
    v-bind="$attrs"
    :class="
      cn(
        'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-input shadow-xs transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=checked]:bg-primary disabled:cursor-not-allowed disabled:opacity-50',
        $props.class
      )
    "
  >
    <SwitchThumb
      class="pointer-events-none block size-4 rounded-full bg-background shadow-sm ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
    />
  </SwitchRoot>
</template>
