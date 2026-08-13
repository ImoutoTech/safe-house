export type NotificationTlsMode = 'none' | 'starttls' | 'tls'

export interface NotificationChannelConfig {
  channelType: 'email'
  enabled: boolean
  host: string | null
  port: number | null
  tlsMode: NotificationTlsMode
  username: string | null
  fromName: string | null
  fromAddress: string | null
  passwordConfigured: boolean
  passwordHint: string | null
  updatedAt: string | null
}

export interface NotificationChannelUpdate {
  enabled: boolean
  host: string | null
  port: number | null
  tlsMode: NotificationTlsMode
  username: string | null
  fromName: string | null
  fromAddress: string | null
  password?: string
}

export interface NotificationTemplate {
  id: string
  key: string
  name: string
  enabled: boolean
  subject: string
  text: string
  html: string | null
  allowedVariables: string[]
  createdAt: string
  updatedAt: string
}

export type NotificationTemplateOption = Pick<
  NotificationTemplate,
  'id' | 'key' | 'name' | 'enabled'
>

export interface NotificationTemplateCreate {
  key: string
  name: string
  enabled: boolean
  subject: string
  text: string
  html: string | null
  allowedVariables: string[]
}

export interface NotificationTemplateUpdate {
  name: string
  subject: string
  text: string
  html: string
  allowedVariables: string[]
}

export interface AppNotificationPolicy {
  appId: string
  directContent: boolean
  manualRecipient: boolean
  templateIds: string[]
  updatedAt: string | null
}

export interface NotificationAdminApp {
  id: string
  name: string
}

export type AppNotificationPolicyUpdate = Pick<
  AppNotificationPolicy,
  'directContent' | 'manualRecipient' | 'templateIds'
>

export interface NotificationApiKey {
  id: string
  hint: string
  enabled: boolean
  lastUsedAt: string | null
  createdAt: string
}

export interface NotificationApiKeyCreated extends NotificationApiKey {
  value: string
}
