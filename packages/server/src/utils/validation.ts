/**
 * Validation utilities for common input validation patterns
 */

import { VALID_COLORS, VALID_COLORS_REGEX } from '@shadle/types'

/**
 * Validates that a puzzle ID is present and non-empty
 */
export function validatePuzzleId(puzzleId: string): { isValid: boolean, error?: string } {
  if (!puzzleId) {
    return { isValid: false, error: 'Puzzle ID is required' }
  }
  return { isValid: true }
}

/**
 * Validates that a device ID is present and non-empty
 */
export function validateDeviceId(deviceId: string | undefined): { isValid: boolean, error?: string } {
  if (!deviceId) {
    return { isValid: false, error: 'Device ID is required' }
  }
  return { isValid: true }
}

/**
 * Validates that a guess string meets the required format
 */
export function validateGuessFormat(guess: string | undefined): { isValid: boolean, error?: string } {
  if (!guess || typeof guess !== 'string') {
    return { isValid: false, error: 'Guess is required and must be a string' }
  }

  if (guess.length !== 5) {
    return { isValid: false, error: 'Guess must be exactly 5 characters' }
  }

  if (!VALID_COLORS_REGEX.test(guess.toUpperCase())) {
    return { isValid: false, error: `Guess must contain only valid color letters: ${VALID_COLORS.join(', ')}` }
  }

  return { isValid: true }
}
