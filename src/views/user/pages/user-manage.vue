<script setup lang="ts">
import { useProviderAdmin } from '@/composables/useProviderAdmin'
import ProviderConfigCard from '../components/provider-config-card.vue'

defineOptions({ name: 'UserManage' })
const { providers, loading, error, save, refresh } = useProviderAdmin()
</script>

<template>
  <main class="provider-page">
    <n-flex v-if="error" vertical align="start">
      <n-alert type="error" title="配置操作失败">{{ error.message }}</n-alert>
      <n-button @click="refresh()">重试</n-button>
    </n-flex>
    <n-spin :show="loading">
      <n-grid cols="1 768:2" :x-gap="16" :y-gap="16">
        <n-grid-item v-for="provider in providers" :key="provider.provider">
          <ProviderConfigCard :provider="provider" :loading="loading" @save="save" />
        </n-grid-item>
      </n-grid>
    </n-spin>
  </main>
</template>

<style scoped>
.provider-page {
  width: 100%;
}
</style>
