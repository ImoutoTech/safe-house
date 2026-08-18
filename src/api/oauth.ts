import api from './api'
import type {
  ExternalBindOutcome,
  ExternalCallbackOutcome,
  ExternalProvider,
  LinkedIdentity,
  OidcInteraction,
  OidcInteractionCompletion,
  ProviderProjection,
  ProviderUpdate,
  Restful
} from '@/types'

export const getEnabledProviders = () =>
  api.Get<Restful<ProviderProjection[]>>('/external/providers')

export const startExternalLogin = (provider: ExternalProvider) =>
  api.Get<Restful<{ authorizationUrl: string }>>(`/external/${provider}/start`)

export const exchangeExternalResult = (id: string) =>
  api.Get<Restful<ExternalCallbackOutcome>>(`/external/result/${encodeURIComponent(id)}`)

export const startExternalBinding = (provider: ExternalProvider, returnTo: string) =>
  api.Get<Restful<{ authorizationUrl: string }>>(`/external/identities/${provider}/start`, {
    params: { return_to: returnTo }
  })

export const getLinkedIdentities = () =>
  api.Get<Restful<LinkedIdentity[]>>('/external/identities/me')

export const bindExternalIdentity = (bindingToken: string) =>
  api.Post<Restful<ExternalBindOutcome>>('/external/identities/bind', { bindingToken })

export const unbindExternalIdentity = (id: number) =>
  api.Delete<Restful<true>>(`/external/identities/${id}`)

export const getAdminProviders = () =>
  api.Get<Restful<ProviderProjection[]>>('/external/admin/providers')

export const updateAdminProvider = (provider: ExternalProvider, data: ProviderUpdate) =>
  api.Post<Restful<ProviderProjection>>(`/external/admin/providers/${provider}`, data)

export const getOidcInteraction = (uid: string) =>
  api.Get<Restful<OidcInteraction>>(`/oauth/interaction/${encodeURIComponent(uid)}`)

export const completeOidcInteraction = (uid: string, approved: boolean) =>
  api.Post<Restful<OidcInteractionCompletion>>(`/oauth/interaction/${encodeURIComponent(uid)}`, {
    approved
  })
