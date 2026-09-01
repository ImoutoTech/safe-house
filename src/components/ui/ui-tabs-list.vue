<script setup lang="ts">
import { TabsList } from 'reka-ui'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiTabsList' })
defineProps<{ class?: string }>()
</script>

<template>
  <TabsList
    :class="
      cn(
        'inline-flex h-9 w-fit items-center justify-center rounded-lg bg-muted p-[3px] text-muted-foreground',
        $props.class
      )
    "
  >
    <slot />
  </TabsList>
</template>
