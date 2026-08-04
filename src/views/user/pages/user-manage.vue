<script setup lang="ts">
import { useProviderAdmin } from '@/composables/useProviderAdmin'
import ProviderConfigCard from '../components/provider-config-card.vue'

defineOptions({ name: 'UserManage' })
const { providers, loading, error, save, refresh } = useProviderAdmin()
</script>

<template>
  <main class="provider-page">
    <n-collapse :default-expanded-names="['login-config']">
      <n-collapse-item name="login-config" title="登录配置">
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
      </n-collapse-item>
    </n-collapse>
  </main>
</template>

<style scoped>
.provider-page {
  width: 100%;
  margin-top: 12px;
}

.provider-page :deep(.n-collapse-item__header-main) {
  color: rgb(31, 34, 37);
  font-size: 16px;
  font-weight: 500;
}

.provider-page :deep(.n-collapse-item__content-inner) {
  padding-top: 20px;
}
</style>
