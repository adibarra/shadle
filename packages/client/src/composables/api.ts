import type { GuessStatus, ValidColor } from '@shadle/types'

const API_BASE = `${window.location.origin}/api/v1`

export async function submitGuess(puzzleId: string, guess: ValidColor[], deviceId: string): Promise<GuessStatus[]> {
  const response = await fetch(`${API_BASE}/guess`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      puzzleId,
      guess,
      deviceId,
    }),
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  const data = await response.json()
  return data.feedback.map((item: { letter: string, status: GuessStatus }) => item.status)
}

export async function getHistory(deviceId: string, puzzleId?: string): Promise<any[]> {
  const url = new URL(`${API_BASE}/history`)
  url.searchParams.set('deviceId', deviceId)
  if (puzzleId) {
    url.searchParams.set('puzzleId', puzzleId)
  }

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}

export async function getStats(puzzleId: string): Promise<any> {
  const response = await fetch(`${API_BASE}/stats?puzzleId=${encodeURIComponent(puzzleId)}`)
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}
