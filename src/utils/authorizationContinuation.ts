const AUTHORIZATION_CONTINUATION_KEY = 'sf-authorization-continuation'

export const normalizeAuthorizationContinuation = (value: unknown): string | null => {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return null

  try {
    const target = new URL(value, window.location.origin)
    if (target.origin !== window.location.origin) return null
    return `${target.pathname}${target.search}${target.hash}`
  } catch {
    return null
  }
}

export const saveAuthorizationContinuation = (value: unknown) => {
  const continuation = normalizeAuthorizationContinuation(value)
  if (!continuation) return

  sessionStorage.setItem(AUTHORIZATION_CONTINUATION_KEY, continuation)
}

export const peekAuthorizationContinuation = () =>
  normalizeAuthorizationContinuation(sessionStorage.getItem(AUTHORIZATION_CONTINUATION_KEY))

export const consumeAuthorizationContinuation = () => {
  const continuation = sessionStorage.getItem(AUTHORIZATION_CONTINUATION_KEY)
  sessionStorage.removeItem(AUTHORIZATION_CONTINUATION_KEY)
  return normalizeAuthorizationContinuation(continuation)
}
