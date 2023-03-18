/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly SH_API_URL: string;
  readonly SH_TITLE: string;
  readonly SH_TOKEN_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
