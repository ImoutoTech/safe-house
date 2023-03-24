/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly SH_API_URL: string;
  readonly SH_TITLE: string;
  readonly SH_LOCALHOST_PREFIX: string;
  readonly SH_PROXY_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
