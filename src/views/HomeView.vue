<script setup lang="ts">
import FlexCenterLayout from '@/layout/FlexCenterLayout.vue'
</script>

<template>
  <flex-center-layout>
    <main>
      <n-flex vertical :size="24">
        <span class="welcome-title">你在森林中看到了一间小木屋</span>
        <n-flex justify="center" :size="24">
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button strong secondary type="primary">敲敲门</n-button>
            </template>
            “看，门外来了个新来的”
          </n-tooltip>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button strong tertiary>推开门</n-button>
            </template>
            你知道这里是哪里
          </n-tooltip>
        </n-flex>
      </n-flex>
    </main>
  </flex-center-layout>
</template>

<style lang="scss" scoped>
.welcome-title {
  font-style: italic;
  font-size: 1.875rem;
  opacity: 0.6;
  user-select: none;
}
</style>
