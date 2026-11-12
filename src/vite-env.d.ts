/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Supabase project URL, e.g. https://abcdefgh.supabase.co */
  readonly VITE_SUPABASE_URL?: string;
  /** Supabase anon (public) key. Safe to ship — RLS enforces access. */
  readonly VITE_SUPABASE_ANON_KEY?: string;
  /**
   * @deprecated Legacy build-time roster. Replaced by Supabase Auth.
   * Kept only so old builds do not fail to compile.
   */
  readonly VITE_ACCESS_ROSTER?: string;
  readonly VITE_APP_TITLE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
