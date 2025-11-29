export function generatePlayerId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

export function getPlayerId(): string {
  let playerId = localStorage.getItem('shadle-player-id')
  if (!playerId) {
    playerId = generatePlayerId()
    localStorage.setItem('shadle-player-id', playerId)
  }
  return playerId
}

export function resetPlayerId(): string {
  const newId = generatePlayerId()
  localStorage.setItem('shadle-player-id', newId)
  return newId
}

export function getStoredLocale(): string | null {
  return localStorage.getItem('locale')
}

export function setStoredLocale(locale: string): void {
  localStorage.setItem('locale', locale)
}

export function saveGameState(key: string, state: any): void {
  localStorage.setItem(key, JSON.stringify(state))
}

export function loadGameState(key: string): any | null {
  const saved = localStorage.getItem(key)
  return saved ? JSON.parse(saved) : null
}

export function removeGameState(key: string): void {
  localStorage.removeItem(key)
}

export function resetGameStates(): void {
  const STORAGE_KEY = 'shadle-game-state'
  localStorage.removeItem(`${STORAGE_KEY}-daily`)
  localStorage.removeItem(`${STORAGE_KEY}-random`)
  localStorage.removeItem(`${STORAGE_KEY}-past`)
}
