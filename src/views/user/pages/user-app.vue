<template>
  <div class="user-app">
    <n-list :show-divider="false" :bordered="false">
      <n-spin :show="loading">
        <template v-if="data.length">
          <n-list-item v-for="item in data" :key="item.id">
            <user-app-item
              :app="item"
              @delete="refresh"
              @update="handleEditApp(item)"
              @inspect="handleInspectSecret(item)"
            />
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
        <n-flex justify="space-between">
          <n-input v-bind="searchBindings" class="search-input" placeholder="按名称搜索" />
          <n-flex class="guide-actions" :wrap="false">
            <n-tooltip>
              <template #trigger>
                <n-button
                  class="guide-button"
                  tertiary
                  aria-label="查看 OIDC / SSO 接入说明"
                  @click="guideVisible = true"
                >
                  <template #icon>
                    <n-icon :component="InformationCircleOutline" />
                  </template>
                </n-button>
              </template>
              OIDC / SSO 接入说明
            </n-tooltip>
            <n-button
              v-permission="PERMISSION_CODE_MAP['新建子应用']"
              tertiary
              type="info"
              @click="createVisible = true"
              >创建子应用</n-button
            >
          </n-flex>
        </n-flex>
      </template>
    </n-list>
  </div>
  <create-user-app v-model:visible="createVisible" @create="refresh"></create-user-app>
  <update-user-app v-model:visible="editVisible" :app="editApp" @update="refresh"></update-user-app>
  <user-app-secret v-model:visible="secretVisible" :app="editApp"></user-app-secret>
  <oidc-integration-guide v-model:visible="guideVisible"></oidc-integration-guide>
</template>
<script lang="ts" setup>
import type { AppInfo } from '@/types'
import { InformationCircleOutline } from '@vicons/ionicons5'
import CreateUserApp from '../components/create-user-app.vue'
import OidcIntegrationGuide from '../components/oidc-integration-guide.vue'
import UpdateUserApp from '../components/update-user-app.vue'
import UserAppSecret from '../components/user-app-secret.vue'
import UserAppItem from '../components/user-app-item.vue'
import { useAppList } from '@/composables/useAppList'
import { PERMISSION_CODE_MAP } from '@/utils/constants'

defineOptions({
  name: 'UserApp'
})

const { refresh, pageBindings, searchBindings, loading, data } = useAppList()
const createVisible = ref(false)
const editVisible = ref(false)
const secretVisible = ref(false)
const guideVisible = ref(false)
const editApp = ref<AppInfo>()

const handleEditApp = (app: AppInfo) => {
  editApp.value = { ...app }
  editVisible.value = true
}

const handleInspectSecret = (app: AppInfo) => {
  editApp.value = { ...app }
  secretVisible.value = true
}
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

  .search-input {
    width: 300px;

    @media (max-width: 768px) {
      flex: 1;
      width: auto;
      min-width: 0;
    }
  }

  .guide-actions {
    flex-shrink: 0;
  }

  .guide-button {
    width: 34px;
    padding: 0;
    border-radius: 3px;
  }
}
</style>
