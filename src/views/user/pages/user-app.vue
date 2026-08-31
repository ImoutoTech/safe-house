<script setup lang="ts">
import { Info, Plus, Search } from 'lucide-vue-next'
import EmptyState from '@/components/patterns/empty-state.vue'
import UiButton from '@/components/ui/ui-button.vue'
import UiInput from '@/components/ui/ui-input.vue'
import UiSpinner from '@/components/ui/ui-spinner.vue'
import { useAppList } from '@/composables/useAppList'
import type { AppInfo } from '@/types'
import { PERMISSION_CODE_MAP } from '@/utils/constants'
import CreateUserApp from '../components/create-user-app.vue'
import OidcIntegrationGuide from '../components/oidc-integration-guide.vue'
import UpdateUserApp from '../components/update-user-app.vue'
import UserAppItem from '../components/user-app-item.vue'
import UserAppSecret from '../components/user-app-secret.vue'

defineOptions({ name: 'UserApp' })
const { refresh, loading, data, searchValue, page, pageSize, total } = useAppList()
const createVisible = shallowRef(false)
const editVisible = shallowRef(false)
const secretVisible = shallowRef(false)
const guideVisible = shallowRef(false)
const editApp = shallowRef<AppInfo>()
const pageCount = computed(() => Math.max(1, Math.ceil((total.value ?? 0) / pageSize.value)))
const handleEditApp = (app: AppInfo) => {
  editApp.value = { ...app }
  editVisible.value = true
}
const handleInspectSecret = (app: AppInfo) => {
  editApp.value = { ...app }
  secretVisible.value = true
}
</script>

<template>
  <section class="grid gap-5">
    <header class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="relative w-full sm:max-w-sm">
        <Search
          class="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground"
          aria-hidden="true"
        /><UiInput
          v-model="searchValue"
          class="pl-9"
          placeholder="按名称搜索"
          :disabled="loading"
          aria-label="按名称搜索子应用"
        />
      </div>
      <div class="flex gap-2">
        <UiButton
          variant="outline"
          size="icon"
          aria-label="查看接入说明"
          @click="guideVisible = true"
          ><Info /></UiButton
        ><UiButton v-permission="PERMISSION_CODE_MAP['新建子应用']" @click="createVisible = true"
          ><Plus />创建子应用</UiButton
        >
      </div>
    </header>
    <div v-if="loading" class="py-12 text-center"><UiSpinner label="正在读取子应用" /></div>
    <div v-else-if="data.length" class="grid gap-3">
      <UserAppItem
        v-for="item in data"
        :key="item.id"
        :app="item"
        @delete="refresh"
        @update="handleEditApp(item)"
        @inspect="handleInspectSecret(item)"
      />
    </div>
    <EmptyState
      v-else
      title="没有找到子应用"
      description="创建一个子应用，开始接入统一登录与通知服务。"
      ><template #action
        ><UiButton v-permission="PERMISSION_CODE_MAP['新建子应用']" @click="createVisible = true"
          ><Plus />创建子应用</UiButton
        ></template
      ></EmptyState
    >
    <footer class="flex items-center justify-between border-t pt-4 text-sm text-muted-foreground">
      <span>共 {{ total }} 个子应用</span>
      <div class="flex items-center gap-2">
        <UiButton size="sm" variant="outline" :disabled="page <= 1 || loading" @click="page--"
          >上一页</UiButton
        ><span>{{ page }} / {{ pageCount }}</span
        ><UiButton
          size="sm"
          variant="outline"
          :disabled="page >= pageCount || loading"
          @click="page++"
          >下一页</UiButton
        >
      </div>
    </footer>
  </section>
  <CreateUserApp v-model:visible="createVisible" @create="refresh" /><UpdateUserApp
    v-model:visible="editVisible"
    :app="editApp"
    @update="refresh"
  /><UserAppSecret v-model:visible="secretVisible" :app="editApp" /><OidcIntegrationGuide
    v-model:visible="guideVisible"
  />
</template>
