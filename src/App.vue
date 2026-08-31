<script setup lang="ts">
import { Map } from 'lucide-vue-next'
import { Toaster } from 'vue-sonner'
import UiSpinner from '@/components/ui/ui-spinner.vue'
import { useBackendInit } from './composables/useBackendInit'
import { useAuthGuard } from './composables/useAuthGuard'

const { loading } = useBackendInit()
useAuthGuard()
</script>

<template>
  <router-view v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <div
        v-if="loading"
        class="fixed inset-0 z-50 grid place-items-center bg-background"
        aria-busy="true"
      >
        <div class="grid justify-items-center gap-4">
          <span class="flex size-12 items-center justify-center rounded-xl border bg-muted/40"
            ><Map class="size-5" aria-hidden="true" /></span
          ><UiSpinner label="地图加载中" />
        </div>
      </div>
      <component v-else :is="Component" />
    </Transition>
  </router-view>
  <Toaster position="top-center" rich-colors close-button />
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 180ms ease-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }
}
</style>
