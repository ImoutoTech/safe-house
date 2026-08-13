import api from './api'
import type {
  AppNotificationPolicy,
  AppNotificationPolicyUpdate,
  NotificationAdminApp,
  NotificationApiKey,
  NotificationApiKeyCreated,
  NotificationChannelConfig,
  NotificationChannelUpdate,
  NotificationTemplate,
  NotificationTemplateCreate,
  NotificationTemplateOption,
  NotificationTemplateUpdate,
  Restful
} from '@/types'

export const getNotificationChannel = () =>
  api.Get<Restful<NotificationChannelConfig>>('/notification-admin/channels/email')

export const updateNotificationChannel = (data: NotificationChannelUpdate) =>
  api.Put<Restful<NotificationChannelConfig>>('/notification-admin/channels/email', data)

export const getNotificationTemplates = () =>
  api.Get<Restful<NotificationTemplate[]>>('/notification-admin/templates')

export const getNotificationTemplateOptions = () =>
  api.Get<Restful<NotificationTemplateOption[]>>('/notification-admin/template-options')

export const createNotificationTemplate = (data: NotificationTemplateCreate) =>
  api.Post<Restful<NotificationTemplate>>('/notification-admin/templates', data)

export const updateNotificationTemplate = (id: string, data: NotificationTemplateUpdate) =>
  api.Put<Restful<NotificationTemplate>>(`/notification-admin/templates/${id}`, data)

export const setNotificationTemplateEnabled = (id: string, enabled: boolean) =>
  api.Put<Restful<NotificationTemplate>>(`/notification-admin/templates/${id}/enabled`, { enabled })

export const getNotificationAdminApps = () =>
  api.Get<Restful<NotificationAdminApp[]>>('/notification-admin/apps')

export const getAppNotificationPolicy = (appId: string) =>
  api.Get<Restful<AppNotificationPolicy>>(`/notification-admin/apps/${appId}/policy`)

export const updateAppNotificationPolicy = (appId: string, data: AppNotificationPolicyUpdate) =>
  api.Put<Restful<AppNotificationPolicy>>(`/notification-admin/apps/${appId}/policy`, data)

export const getNotificationApiKeys = (appId: string) =>
  api.Get<Restful<NotificationApiKey[]>>(`/apps/${appId}/notification-keys`)

export const createNotificationApiKey = (appId: string) =>
  api.Post<Restful<NotificationApiKeyCreated>>(`/apps/${appId}/notification-keys`)

export const setNotificationApiKeyEnabled = (appId: string, keyId: string, enabled: boolean) =>
  api.Put<Restful<NotificationApiKey>>(`/apps/${appId}/notification-keys/${keyId}/enabled`, {
    enabled
  })

export const deleteNotificationApiKey = (appId: string, keyId: string) =>
  api.Delete<Restful<true>>(`/apps/${appId}/notification-keys/${keyId}`)
