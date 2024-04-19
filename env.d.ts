/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_TITLE: string
  readonly VITE_COPYRIGHT_NAME: string
  readonly VITE_COPYRIGHT_YEAR: string
  readonly VITE_BUILD_COMMIT: string
  readonly VITE_BUILD_BRANCH: string
  readonly VITE_CONFIG_URL: string

  readonly VITE_GRAVATAR_BASE: string
  readonly VITE_QQ_AVATAR_BASE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
