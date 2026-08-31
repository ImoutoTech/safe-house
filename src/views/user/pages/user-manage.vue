<script setup lang="ts">
import UiAlert from '@/components/ui/ui-alert.vue'
import UiButton from '@/components/ui/ui-button.vue'
import UiSpinner from '@/components/ui/ui-spinner.vue'
import { useNotificationAdmin } from '@/composables/useNotificationAdmin'
import { useProviderAdmin } from '@/composables/useProviderAdmin'
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
const admin = useNotificationAdmin()
const templateFormVisible = shallowRef(false)
const editingTemplate = shallowRef<NotificationTemplate>()
const hasManagementSection = computed(
  () =>
    canManageProvider.value ||
    admin.canManageChannel.value ||
    admin.canManageTemplates.value ||
    admin.canManagePolicies.value
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
  if (await admin.saveTemplate(draft, editingTemplate.value)) templateFormVisible.value = false
}
const retryPolicy = async () => {
  await Promise.all([admin.refreshApps(), admin.refreshTemplateOptions()])
  if (admin.selectedAppId.value) await admin.selectPolicyApp(admin.selectedAppId.value)
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
  <main class="grid gap-5">
    <UiAlert v-if="!hasManagementSection" variant="warning" title="无管理权限"
      >当前账号没有可用的管理配置权限。</UiAlert
    >
    <section v-if="canManageProvider" class="grid gap-4 rounded-xl border p-5">
      <header>
        <h2 class="font-semibold">外部登录</h2>
        <p class="mt-1 text-sm text-muted-foreground">配置 GitHub 与 Google 登录入口。</p>
      </header>
      <div v-if="error" class="grid gap-3">
        <UiAlert variant="destructive" title="配置操作失败">{{ error.message }}</UiAlert
        ><UiButton variant="outline" class="w-fit" @click="refresh()">重试</UiButton>
      </div>
      <div v-if="loading && !providers.length" class="py-5 text-center"><UiSpinner /></div>
      <div v-else class="grid gap-4 md:grid-cols-2">
        <ProviderConfigCard
          v-for="provider in providers"
          :key="provider.provider"
          :provider="provider"
          :loading="loading"
          @save="save"
        />
      </div>
    </section>
    <section v-if="admin.canManageChannel.value" class="grid gap-4 rounded-xl border p-5">
      <header>
        <h2 class="font-semibold">通信渠道</h2>
        <p class="mt-1 text-sm text-muted-foreground">维护通知邮件的 SMTP 出口。</p>
      </header>
      <UiAlert v-if="admin.channelError.value" variant="destructive" title="SMTP 配置加载失败">{{
        admin.channelError.value.message
      }}</UiAlert
      ><NotificationChannelForm
        :config="admin.channel.value"
        :loading="admin.channelLoading.value"
        @save="admin.saveChannel"
        @retry="admin.refreshChannel"
      />
    </section>
    <section v-if="admin.canManageTemplates.value" class="grid gap-4 rounded-xl border p-5">
      <header>
        <h2 class="font-semibold">消息模板</h2>
        <p class="mt-1 text-sm text-muted-foreground">管理通知主题、正文和允许变量。</p>
      </header>
      <NotificationTemplateList
        :templates="admin.templates.value"
        :loading="admin.templateLoading.value"
        :error="admin.templateError.value"
        @create="openCreateTemplate"
        @edit="openEditTemplate"
        @toggle="admin.toggleTemplate"
        @retry="admin.refreshTemplates"
      />
    </section>
    <section v-if="admin.canManagePolicies.value" class="grid gap-4 rounded-xl border p-5">
      <header>
        <h2 class="font-semibold">应用通知权限</h2>
        <p class="mt-1 text-sm text-muted-foreground">按子应用收紧模板和收件人能力。</p>
      </header>
      <AppNotificationPolicy
        :apps="admin.apps.value"
        :templates="admin.templateOptions.value"
        :policy="admin.policy.value"
        :selected-app-id="admin.selectedAppId.value"
        :loading="admin.policyLoading.value"
        :error="admin.policyError.value"
        @select="admin.selectPolicyApp"
        @save="admin.savePolicy"
        @retry="retryPolicy"
      />
    </section>
    <NotificationTemplateForm
      v-model:visible="templateFormVisible"
      :template="editingTemplate"
      :loading="admin.templateLoading.value"
      @save="handleSaveTemplate"
    />
  </main>
</template>
