/**
 * Validation utilities for common input validation patterns
 */

import type { ValidColor } from '@shadle/types'
import { VALID_COLORS } from '@shadle/types'

/**
 * Validates that a puzzle ID is present and non-empty
 */
export function validatePuzzleId(puzzleId: string): { isValid: boolean, error?: string } {
  if (!puzzleId) {
    return { isValid: false, error: 'Puzzle ID is required.' }
  }
  return { isValid: true }
}

/**
 * Validates that a device ID is present and non-empty
 */
export function validateDeviceId(deviceId: string | undefined): { isValid: boolean, error?: string } {
  if (!deviceId) {
    return { isValid: false, error: 'Device ID is required.' }
  }
  return { isValid: true }
}

/**
 * Validates that a guess array meets the required format
 */
export function validateGuessFormat(guess: ValidColor[] | undefined): { isValid: boolean, error?: string } {
  if (!Array.isArray(guess) || guess.length === 0) {
    return { isValid: false, error: 'Guess is required and must be an array.' }
  }

  if (guess.length !== 5) {
    return { isValid: false, error: 'Guess must be exactly 5 colors.' }
  }

  if (!guess.every(c => VALID_COLORS.includes(c))) {
    return { isValid: false, error: `Guess must contain only valid color letters: ${VALID_COLORS.join(', ')}.` }
  }

  return { isValid: true }
}
