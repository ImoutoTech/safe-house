import type { ExternalProvider, ProviderProjection } from '../types/oauth'

export const ADMIN_PROVIDER_ORDER = [
  'github',
  'google'
] as const satisfies readonly ExternalProvider[]

const createProviderDraft = (provider: ExternalProvider): ProviderProjection => ({
  provider,
  enabled: false,
  clientId: '',
  configured: false,
  secretHint: null,
  updatedAt: null
})

const sanitizeProvider = (provider: ProviderProjection): ProviderProjection => ({
  provider: provider.provider,
  enabled: provider.enabled,
  clientId: provider.clientId,
  configured: provider.configured,
  secretHint: provider.secretHint,
  updatedAt: provider.updatedAt
})

export const projectAdminProviders = (
  providers: readonly ProviderProjection[]
): ProviderProjection[] => {
  const providersByName = new Map(providers.map((provider) => [provider.provider, provider]))

  return ADMIN_PROVIDER_ORDER.map((provider) => {
    const savedProvider = providersByName.get(provider)
    return savedProvider ? sanitizeProvider(savedProvider) : createProviderDraft(provider)
  })
}
