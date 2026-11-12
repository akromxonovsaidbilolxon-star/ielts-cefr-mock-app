/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base64 (or raw JSON) array of allowed users. Baked in at build time. */
  readonly VITE_ACCESS_ROSTER?: string;
  readonly VITE_APP_TITLE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
