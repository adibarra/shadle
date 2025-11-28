declare module 'virtual:pwa-register/vue' {
  export function useRegisterSW(): {
    needRefresh: import('vue').Ref<boolean>
    updateServiceWorker: (reload?: boolean) => Promise<void>
  }
}

declare interface Window {
  adsbygoogle?: any[]
}
