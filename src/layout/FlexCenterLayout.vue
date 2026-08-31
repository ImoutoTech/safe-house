<script setup lang="ts">
defineOptions({ name: 'FlexCenterLayout' })
withDefaults(defineProps<{ type?: 'router' | 'slot' }>(), { type: 'slot' })
</script>

<template>
  <div class="flex min-h-full w-full items-center justify-center px-4 py-10 sm:px-6">
    <slot v-if="type === 'slot'" />
    <router-view v-else />
  </div>
</template>
