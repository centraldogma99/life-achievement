/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_GEMINI_API_KEY: string
}
