<script setup lang="ts">
import { useProviderAdmin } from '@/composables/useProviderAdmin'
import { useNotificationAdmin } from '@/composables/useNotificationAdmin'
import { useUserStore } from '@/stores/user'
import type { NotificationTemplate, NotificationTemplateCreate } from '@/types'
import { UserRole } from '@reus-able/types'
import AppNotificationPolicy from '../components/app-notification-policy.vue'
import NotificationChannelForm from '../components/notification-channel-form.vue'
import NotificationTemplateForm from '../components/notification-template-form.vue'
import NotificationTemplateList from '../components/notification-template-list.vue'
import ProviderConfigCard from '../components/provider-config-card.vue'

defineOptions({ name: 'UserManage' })
const userStore = useUserStore()
const canManageProvider = computed(
  () =>
    userStore.userData.role === UserRole.ADMIN ||
    userStore.userPermissions.includes('oauth-provider-admin')
)
const { providers, loading, error, save, refresh } = useProviderAdmin(false)
const {
  canManageChannel,
  canManageTemplates,
  canManagePolicies,
  channel,
  templates,
  templateOptions,
  apps,
  policy,
  selectedAppId,
  channelLoading,
  templateLoading,
  policyLoading,
  channelError,
  templateError,
  policyError,
  refreshChannel,
  saveChannel,
  refreshTemplates,
  refreshTemplateOptions,
  saveTemplate,
  toggleTemplate,
  refreshApps,
  selectPolicyApp,
  savePolicy
} = useNotificationAdmin()

const templateFormVisible = shallowRef(false)
const editingTemplate = shallowRef<NotificationTemplate>()
const hasManagementSection = computed(
  () =>
    canManageProvider.value ||
    canManageChannel.value ||
    canManageTemplates.value ||
    canManagePolicies.value
)

const openCreateTemplate = () => {
  editingTemplate.value = undefined
  templateFormVisible.value = true
}

const openEditTemplate = (template: NotificationTemplate) => {
  editingTemplate.value = template
  templateFormVisible.value = true
}

const handleSaveTemplate = async (draft: NotificationTemplateCreate) => {
  const saved = await saveTemplate(draft, editingTemplate.value)
  if (saved) templateFormVisible.value = false
}

const retryPolicy = async () => {
  await Promise.all([refreshApps(), refreshTemplateOptions()])
  if (selectedAppId.value) await selectPolicyApp(selectedAppId.value)
}

watch(
  canManageProvider,
  (allowed) => {
    if (allowed) void refresh()
  },
  { immediate: true }
)
</script>

<template>
  <main class="manage-page">
    <n-alert v-if="!hasManagementSection" type="warning" title="无管理权限">
      当前账号没有可用的管理配置权限。
    </n-alert>
    <n-collapse :default-expanded-names="['login-config', 'notification-channel']">
      <n-collapse-item v-if="canManageProvider" name="login-config" title="登录配置">
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
      <n-collapse-item v-if="canManageChannel" name="notification-channel" title="通信渠道">
        <n-alert v-if="channelError" type="error" title="SMTP 配置加载失败">
          {{ channelError.message }}
        </n-alert>
        <NotificationChannelForm
          :config="channel"
          :loading="channelLoading"
          @save="saveChannel"
          @retry="refreshChannel"
        />
      </n-collapse-item>
      <n-collapse-item v-if="canManageTemplates" name="notification-templates" title="消息模板">
        <NotificationTemplateList
          :templates="templates"
          :loading="templateLoading"
          :error="templateError"
          @create="openCreateTemplate"
          @edit="openEditTemplate"
          @toggle="toggleTemplate"
          @retry="refreshTemplates"
        />
      </n-collapse-item>
      <n-collapse-item v-if="canManagePolicies" name="notification-policy" title="应用通知权限">
        <AppNotificationPolicy
          :apps="apps"
          :templates="templateOptions"
          :policy="policy"
          :selected-app-id="selectedAppId"
          :loading="policyLoading"
          :error="policyError"
          @select="selectPolicyApp"
          @save="savePolicy"
          @retry="retryPolicy"
        />
      </n-collapse-item>
    </n-collapse>
    <NotificationTemplateForm
      v-model:visible="templateFormVisible"
      :template="editingTemplate"
      :loading="templateLoading"
      @save="handleSaveTemplate"
    />
  </main>
</template>

<style scoped>
.manage-page {
  width: 100%;
  margin-top: 12px;
}

.manage-page :deep(.n-collapse-item__header-main) {
  color: rgb(31, 34, 37);
  font-size: 16px;
  font-weight: 500;
}

.manage-page :deep(.n-collapse-item__content-inner) {
  padding-top: 20px;
}
</style>
