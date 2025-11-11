import type { UserModule } from '~/types'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// configure nprogress
NProgress.configure({
  showSpinner: false,
  minimum: 0.08,
  easing: 'ease',
  speed: 200,
  trickleSpeed: 50,
})

// style nprogress to match chakra ui theme
const style = document.createElement('style')
style.textContent = `
  #nprogress {
    pointer-events: none;
  }
  #nprogress .bar {
    background: var(--chakra-colors-green-500) !important;
    position: fixed;
    z-index: 1031;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
  }
  #nprogress .peg {
    display: block;
    position: absolute;
    right: 0px;
    width: 100px;
    height: 100%;
    box-shadow: 0 0 10px var(--color-accent), 0 0 5px var(--color-accent);
    opacity: 1.0;
    transform: rotate(3deg) translate(0px, -4px);
  }
`
document.head.appendChild(style)

export const install: UserModule = async () => {
  let activeRequests = 0

  // intercept fetch requests to show progress
  const originalFetch = window.fetch
  window.fetch = async (...args) => {
    if (activeRequests === 0) {
      NProgress.start()
    }
    activeRequests++

    try {
      const result = await originalFetch(...args)
      activeRequests--
      if (activeRequests === 0) {
        NProgress.done()
      }
      return result
    } catch (error) {
      activeRequests--
      if (activeRequests === 0) {
        NProgress.done()
      }
      throw error
    }
  }

  // make nprogress available globally for manual control
  ;(window as any).NProgress = NProgress
}
