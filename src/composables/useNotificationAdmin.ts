import {
  createNotificationTemplate,
  getAppNotificationPolicy,
  getNotificationAdminApps,
  getNotificationChannel,
  getNotificationTemplateOptions,
  getNotificationTemplates,
  setNotificationTemplateEnabled,
  updateAppNotificationPolicy,
  updateNotificationChannel,
  updateNotificationTemplate
} from '@/api/notification'
import { useUserStore } from '@/stores/user'
import type {
  AppNotificationPolicy,
  AppNotificationPolicyUpdate,
  NotificationChannelUpdate,
  NotificationTemplate,
  NotificationTemplateCreate,
  NotificationTemplateUpdate
} from '@/types'
import { NOTIFICATION_PERMISSION } from '@/utils/constants'
import { useRequest } from 'alova'
import { UserRole } from '@reus-able/types'
import { useFeedback } from './useFeedback'

export const useNotificationAdmin = () => {
  const userStore = useUserStore()
  const feedback = useFeedback()
  const selectedAppId = shallowRef('')
  const selectedPolicy = shallowRef<AppNotificationPolicy>()

  const canManageChannel = computed(
    () =>
      userStore.userData.role === UserRole.ADMIN ||
      userStore.userPermissions.includes(NOTIFICATION_PERMISSION.channel)
  )
  const canManageTemplates = computed(
    () =>
      userStore.userData.role === UserRole.ADMIN ||
      userStore.userPermissions.includes(NOTIFICATION_PERMISSION.template)
  )
  const canManagePolicies = computed(
    () =>
      userStore.userData.role === UserRole.ADMIN ||
      userStore.userPermissions.includes(NOTIFICATION_PERMISSION.policy)
  )

  const channelListRequest = useRequest(getNotificationChannel, { immediate: false })
  const channelSaveRequest = useRequest(updateNotificationChannel, { immediate: false })
  const templateListRequest = useRequest(getNotificationTemplates, { immediate: false })
  const templateOptionListRequest = useRequest(getNotificationTemplateOptions, { immediate: false })
  const templateCreateRequest = useRequest(createNotificationTemplate, { immediate: false })
  const templateUpdateRequest = useRequest(
    ({ id, data }: { id: string; data: NotificationTemplateUpdate }) =>
      updateNotificationTemplate(id, data),
    { immediate: false }
  )
  const templateToggleRequest = useRequest(
    ({ id, enabled }: { id: string; enabled: boolean }) =>
      setNotificationTemplateEnabled(id, enabled),
    { immediate: false }
  )
  const appListRequest = useRequest(getNotificationAdminApps, { immediate: false })
  const policyListRequest = useRequest((appId: string) => getAppNotificationPolicy(appId), {
    immediate: false
  })
  const policySaveRequest = useRequest(
    ({ appId, data }: { appId: string; data: AppNotificationPolicyUpdate }) =>
      updateAppNotificationPolicy(appId, data),
    { immediate: false }
  )

  const reportError = (error: unknown, fallback: string) => {
    feedback.error(error instanceof Error ? error.message : fallback)
  }

  const refreshChannel = async () => {
    if (!canManageChannel.value) return
    try {
      await channelListRequest.send()
    } catch (error) {
      reportError(error, '通信渠道加载失败')
    }
  }

  const saveChannel = async (draft: NotificationChannelUpdate) => {
    const data = { ...draft }
    if (!data.password?.trim()) delete data.password
    try {
      await channelSaveRequest.send(data)
      await channelListRequest.send()
      feedback.success('SMTP 配置已保存')
    } catch (error) {
      reportError(error, 'SMTP 配置保存失败')
    }
  }

  const refreshTemplates = async () => {
    if (!canManageTemplates.value) return
    try {
      await templateListRequest.send()
    } catch (error) {
      reportError(error, '消息模板加载失败')
    }
  }

  const refreshTemplateOptions = async () => {
    if (!canManagePolicies.value) return
    try {
      await templateOptionListRequest.send()
    } catch (error) {
      reportError(error, '消息模板选项加载失败')
    }
  }

  const saveTemplate = async (
    draft: NotificationTemplateCreate,
    template?: NotificationTemplate
  ) => {
    try {
      if (template) {
        const update: NotificationTemplateUpdate = {
          name: draft.name,
          subject: draft.subject,
          text: draft.text,
          html: draft.html ?? '',
          allowedVariables: draft.allowedVariables
        }
        await templateUpdateRequest.send({ id: template.id, data: update })
      } else {
        await templateCreateRequest.send(draft)
      }
      await templateListRequest.send()
      feedback.success('消息模板已保存')
      return true
    } catch (error) {
      reportError(error, '消息模板保存失败')
      return false
    }
  }

  const toggleTemplate = async (template: NotificationTemplate, enabled: boolean) => {
    try {
      await templateToggleRequest.send({ id: template.id, enabled })
      await templateListRequest.send()
      feedback.success(enabled ? '消息模板已启用' : '消息模板已停用')
    } catch (error) {
      reportError(error, '消息模板状态更新失败')
    }
  }

  const refreshApps = async () => {
    if (!canManagePolicies.value) return
    try {
      await appListRequest.send()
    } catch (error) {
      reportError(error, '子应用加载失败')
    }
  }

  const selectPolicyApp = async (appId: string) => {
    selectedAppId.value = appId
    selectedPolicy.value = undefined
    if (!appId) return
    try {
      const response = await policyListRequest.send(appId)
      if (selectedAppId.value === appId) selectedPolicy.value = response.data
    } catch (error) {
      reportError(error, '应用通知权限加载失败')
    }
  }

  const savePolicy = async (draft: AppNotificationPolicyUpdate) => {
    if (!selectedAppId.value) return
    try {
      await policySaveRequest.send({ appId: selectedAppId.value, data: draft })
      await selectPolicyApp(selectedAppId.value)
      feedback.success('应用通知权限已保存')
    } catch (error) {
      reportError(error, '应用通知权限保存失败')
    }
  }

  watch(
    canManageChannel,
    (allowed) => {
      if (allowed) void refreshChannel()
    },
    { immediate: true }
  )
  watch(
    canManageTemplates,
    (allowed) => {
      if (allowed) void refreshTemplates()
    },
    { immediate: true }
  )
  watch(
    canManagePolicies,
    (allowed) => {
      if (allowed) {
        void refreshApps()
        void refreshTemplateOptions()
      }
    },
    { immediate: true }
  )

  return {
    canManageChannel,
    canManageTemplates,
    canManagePolicies,
    channel: computed(() => channelListRequest.data.value?.data),
    templates: computed(() => templateListRequest.data.value?.data ?? []),
    templateOptions: computed(() => templateOptionListRequest.data.value?.data ?? []),
    apps: computed(() => appListRequest.data.value?.data ?? []),
    policy: computed(() => selectedPolicy.value),
    selectedAppId: readonly(selectedAppId),
    channelLoading: computed(
      () => channelListRequest.loading.value || channelSaveRequest.loading.value
    ),
    templateLoading: computed(
      () =>
        templateListRequest.loading.value ||
        templateCreateRequest.loading.value ||
        templateUpdateRequest.loading.value ||
        templateToggleRequest.loading.value
    ),
    policyLoading: computed(
      () =>
        appListRequest.loading.value ||
        templateOptionListRequest.loading.value ||
        policyListRequest.loading.value ||
        policySaveRequest.loading.value
    ),
    channelError: computed(() => channelListRequest.error.value),
    templateError: computed(() => templateListRequest.error.value),
    policyError: computed(
      () =>
        appListRequest.error.value ||
        templateOptionListRequest.error.value ||
        policyListRequest.error.value
    ),
    refreshChannel,
    saveChannel,
    refreshTemplates,
    refreshTemplateOptions,
    saveTemplate,
    toggleTemplate,
    refreshApps,
    selectPolicyApp,
    savePolicy
  }
}
