<script setup lang="ts">
import { TabsRoot } from 'reka-ui'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiTabs' })
const model = defineModel<string | number>({ required: true })
defineProps<{ class?: string; activationMode?: 'automatic' | 'manual' }>()
</script>

<template>
  <TabsRoot
    v-model="model"
    :activation-mode="activationMode"
    :class="cn('flex flex-col gap-2', $props.class)"
  >
    <slot />
  </TabsRoot>
</template>
