<template>
  <div class="user-app">
    <n-list :show-divider="false" :bordered="false">
      <n-spin :show="loading">
        <template v-if="data.length">
          <n-list-item v-for="item in data" :key="item.id">
            <user-app-item :app="item" />
          </n-list-item>
        </template>
        <template v-else>
          <n-empty class="empty" description="没有找到子应用"></n-empty>
        </template>
      </n-spin>

      <template #footer>
        <n-flex justify="space-between" align="center">
          <n-text depth="3">共{{ pageBindings.itemCount }}个子应用</n-text>
          <n-pagination v-bind="pageBindings"></n-pagination>
        </n-flex>
      </template>
      <template #header>
        <n-input v-bind="searchBindings" placeholder="按名称搜索" />
      </template>
    </n-list>
  </div>
</template>
<script lang="ts" setup>
import UserAppItem from './components/user-app-item.vue'
import { useAppList } from '@/composables/useAppList'

defineOptions({
  name: 'UserApp'
})

const { pageBindings, searchBindings, loading, data } = useAppList()
</script>
<style lang="scss" scoped>
.user-app {
  margin-top: 8px;

  .empty {
    margin: 50px 0;
  }

  :deep(.n-list__header) {
    padding: 12px 0;
  }

  :deep(.n-list__footer) {
    padding: 12px 0;
  }
}
</style>
