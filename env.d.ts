/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMetaEnv {
  readonly VITE_GA_TRACKING_ID: string;
  readonly VITE_CLARITY_TRACKING_ID: string;
  readonly VITE_CLOUDFLARE_RUM_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
