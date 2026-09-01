<script setup lang="ts">
import { TabsContent } from 'reka-ui'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiTabsContent' })
defineProps<{ value: string | number; class?: string }>()
</script>

<template>
  <TabsContent :value="value" :class="cn('flex-1 outline-none', $props.class)">
    <slot />
  </TabsContent>
</template>
