/**
 * Validation utilities for common input validation patterns
 */

import { VALID_COLORS, VALID_COLORS_REGEX } from '@shadle/types'

/**
 * Validates that a date string is in YYYY-MM-DD format and represents a valid, non-future date
 */
export function validatePuzzleDate(dateString: string): { isValid: boolean, error?: string } {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return { isValid: false, error: 'Invalid date format. Use YYYY-MM-DD.' }
  }

  const requestedDate = new Date(`${dateString}T00:00:00.000Z`)
  if (Number.isNaN(requestedDate.getTime())) {
    return { isValid: false, error: 'Invalid date format. Use YYYY-MM-DD.' }
  }

  const today = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()))
  if (requestedDate > today) {
    return { isValid: false, error: 'Cannot request data for future dates.' }
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
