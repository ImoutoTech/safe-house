import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import type { ProviderProjection } from '../src/types/oauth.js'
import { projectAdminProviders } from '../src/utils/providerAdmin.js'

test('relies on the protected admin route instead of hiding the save action again', () => {
  const cardSource = readFileSync(
    new URL('../src/views/admin/ProviderConfigCard.vue', import.meta.url),
    'utf8'
  )
  const routerSource = readFileSync(new URL('../src/router/index.ts', import.meta.url), 'utf8')

  assert.doesNotMatch(cardSource, /v-permission/)
  assert.match(
    routerSource,
    /path:\s*['"]admin\/providers['"][\s\S]*?permission:\s*['"]oauth-provider-admin['"]/m
  )
})

test('projects safe GitHub and Google drafts when the backend has no records', () => {
  assert.deepEqual(projectAdminProviders([]), [
    {
      provider: 'github',
      enabled: false,
      clientId: '',
      configured: false,
      secretHint: null,
      updatedAt: null
    },
    {
      provider: 'google',
      enabled: false,
      clientId: '',
      configured: false,
      secretHint: null,
      updatedAt: null
    }
  ])
})

test('merges backend projections into the stable provider order', () => {
  const google: ProviderProjection = {
    provider: 'google',
    enabled: true,
    clientId: 'google-client',
    configured: true,
    secretHint: '****1234',
    updatedAt: '2026-08-03T00:00:00.000Z'
  }

  const projected = projectAdminProviders([google])

  assert.equal(projected[0]?.provider, 'github')
  assert.deepEqual(projected[1], google)
  assert.notEqual(projected[1], google)
  assert.equal('clientSecret' in projected[0]!, false)
})

test('deduplicates unordered records and strips unexpected secret fields', () => {
  const firstGoogle: ProviderProjection = {
    provider: 'google',
    enabled: false,
    clientId: 'stale-google-client',
    configured: false,
    secretHint: null,
    updatedAt: null
  }
  const github: ProviderProjection & { clientSecret: string } = {
    provider: 'github',
    enabled: true,
    clientId: 'github-client',
    clientSecret: 'must-not-enter-ui-state',
    configured: true,
    secretHint: '****1234',
    updatedAt: '2026-08-03T00:00:00.000Z'
  }
  const latestGoogle: ProviderProjection = {
    provider: 'google',
    enabled: true,
    clientId: 'current-google-client',
    configured: true,
    secretHint: '****5678',
    updatedAt: '2026-08-03T01:00:00.000Z'
  }

  const projected = projectAdminProviders([firstGoogle, github, latestGoogle])

  assert.deepEqual(
    projected.map(({ provider }) => provider),
    ['github', 'google']
  )
  assert.equal(projected[1]?.clientId, 'current-google-client')
  assert.equal('clientSecret' in projected[0]!, false)
})
