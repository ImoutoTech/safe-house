<template>
  <n-message-provider>
    <n-dialog-provider>
      <n-modal-provider>
        <router-view v-slot="{ Component }">
          <Transition Transition name="fade" mode="out-in">
            <div v-if="loading" class="backend-waiting-wrapper">
              <n-spin size="large" />
              <span>地图加载中</span>
            </div>
            <component v-else :is="Component" />
          </Transition>
        </router-view>
      </n-modal-provider>
    </n-dialog-provider>
  </n-message-provider>
</template>
<script setup lang="ts">
import { useBackendInit } from './composables/useBackendInit'
import { useAuthGuard } from './composables/useAuthGuard'

const { loading } = useBackendInit()
useAuthGuard()
</script>
<style scoped lang="scss">
.backend-waiting-wrapper {
  background-color: #fff;
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  row-gap: 12px;

  span {
    opacity: 0.5;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
