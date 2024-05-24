/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND: string;
  readonly VITE_EVENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
