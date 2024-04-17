<script setup lang="ts">
import FlexCenterLayout from '@/layout/FlexCenterLayout.vue'
import { isNil } from 'lodash-es'
import { useConfig } from '@/composables/useConfig'

const router = useRouter()

const { config } = useConfig(true)

const displayTitle = computed(() =>
  config.value?.title?.length ? config.value.title : ['少女祈祷中']
)

const handleDirect = (name: 'login' | 'register') => {
  router.push({ name })
}
</script>

<template>
  <flex-center-layout>
    <main>
      <n-flex vertical :size="24">
        <span v-for="line in displayTitle" :key="line" class="welcome-title">
          {{ line }}
        </span>
        <n-flex v-if="!isNil(config)" justify="center" :size="24">
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button strong secondary type="primary" @click="handleDirect('register')">
                {{ config.register.btn }}
              </n-button>
            </template>
            {{ config.register.description }}
          </n-tooltip>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button strong tertiary @click="handleDirect('login')">
                {{ config.login.btn }}
              </n-button>
            </template>
            {{ config.login.description }}
          </n-tooltip>
        </n-flex>
      </n-flex>
    </main>
  </flex-center-layout>
</template>
