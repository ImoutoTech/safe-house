<script setup lang="ts">
import { TabsTrigger } from 'reka-ui'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiTabsTrigger' })
defineProps<{ value: string | number; disabled?: boolean; class?: string }>()
</script>

<template>
  <TabsTrigger
    type="button"
    :value="value"
    :disabled="disabled"
    :class="
      cn(
        'inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap text-foreground transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0',
        $props.class
      )
    "
  >
    <slot />
  </TabsTrigger>
</template>
