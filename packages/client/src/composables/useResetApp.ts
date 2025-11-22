import { generateDeviceId } from '../utils'

export function useResetApp() {
  const resetApp = () => {
    localStorage.setItem('shadle-device-id', generateDeviceId())
    localStorage.removeItem('shadle-game-state')
    window.location.reload()
  }

  return { resetApp }
}
