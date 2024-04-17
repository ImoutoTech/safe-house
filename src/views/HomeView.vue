<script setup lang="ts">
import FlexCenterLayout from '@/layout/FlexCenterLayout.vue'
import { useRequest } from 'alova'
import { getDynamicConfig } from '@/api/config'
import { isNil } from 'lodash-es'

interface Config {
  title: string[]
  login: Record<'btn' | 'description', string>
  register: Record<'btn' | 'description', string>
}

const router = useRouter()

const { data } = useRequest(getDynamicConfig<Config>('safe-house-index'))

const displayTitle = computed(() => (data.value?.title?.length ? data.value.title : ['少女祈祷中']))

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
        <n-flex v-if="!isNil(data)" justify="center" :size="24">
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button strong secondary type="primary" @click="handleDirect('login')">
                {{ data.register.btn }}
              </n-button>
            </template>
            {{ data.register.description }}
          </n-tooltip>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button strong tertiary @click="handleDirect('login')">
                {{ data.login.btn }}
              </n-button>
            </template>
            {{ data.login.description }}
          </n-tooltip>
        </n-flex>
      </n-flex>
    </main>
  </flex-center-layout>
</template>
