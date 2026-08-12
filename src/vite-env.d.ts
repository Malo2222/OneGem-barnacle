/// <reference types="vite/client" />

// Public Supabase values injected into the client bundle at build time via the
// `define` block in vite.config.ts. Declared here so dot-access type-checks and
// esbuild's `define` replacement applies (bracket access is NOT replaced).
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
