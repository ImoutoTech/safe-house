import type { UserInfo } from './user'

export type ExternalProvider = 'github' | 'google'

export interface ProviderProjection {
  provider: ExternalProvider
  enabled: boolean
  clientId: string
  configured: boolean
  secretHint: string | null
  updatedAt: string | null
}

export type ExternalCallbackOutcome =
  | { outcome: 'authenticated'; token: string; refresh: string; user: UserInfo }
  | { outcome: 'bound'; user: UserInfo }
  | { outcome: 'identity_not_bound' }
  | { outcome: 'binding_required'; bindingToken: string }
  | { outcome: 'verified_email_required' }
  | { outcome: 'cancelled' }
  | { outcome: 'state_invalid_or_expired' }
  | { outcome: 'provider_disabled' }
  | { outcome: 'provider_misconfigured' }
  | { outcome: 'provider_error' }

export interface LinkedIdentity {
  id: number
  provider: ExternalProvider
  email: string | null
  displayName: string | null
  avatarUrl: string | null
  createdAt: string
}

export interface OidcInteraction {
  uid: string
  client: { id: string; name: string; description: string | null }
  prompt: string
  scope: string
}

export interface OidcInteractionCompletion {
  continuationUrl: string
}

export interface ProviderUpdate {
  clientId?: string
  clientSecret?: string
  enabled?: boolean
}

export interface ExternalBindOutcome {
  outcome: 'bound'
  token: string
  refresh: string
  user: UserInfo
}
