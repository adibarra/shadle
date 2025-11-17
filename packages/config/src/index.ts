import { env } from 'node:process'
import { PROJECT_ROOT_DIR } from '@shadle/constants'
import dotenv from 'dotenv'

/**
 * Schema for environment variables loaded from .env files.
 *
 * Used to type-check the configuration object returned by getConfig().
 */
interface DotEnvSchema {
  IS_TEST: boolean
  IS_PROD: boolean
  IS_DEV: boolean
  IS_CI: boolean
  API_HOST: string
  API_PORT: number
  API_CORS_ORIGIN_REGEX: string
  POSTGRES_URL: string
  POSTGRES_TEST_URL: string
  PUZZLE_SALT: string
  LOG_LEVEL: {
    CONSOLE: string
    FILE: string
    MIN: string
  }
}

/**
 * Loads and validates environment variables from the appropriate .env file.
 *
 * Returns a typed configuration object for use throughout the application.
 * Uses sensible defaults if .env file is missing, with warnings.
 *
 * @returns {DotEnvSchema} The validated configuration object.
 */
function getConfig(): DotEnvSchema {
  const filename = '.env'
  const config = dotenv.config({ path: `${PROJECT_ROOT_DIR}/${filename}`, quiet: true, processEnv: {} })

  const parsed = config.parsed || {}

  if (config.error || !config.parsed) {
    console.warn(`Could not load ${filename} file (${config.error?.message || 'file not found'})`)
    console.warn('Using default values. This may not be suitable for production.')
  }

  const IS_TEST = env.NODE_ENV?.toLowerCase().includes('test') || false
  const IS_PROD = env.NODE_ENV?.toLowerCase().includes('prod') || false
  const IS_DEV = env.NODE_ENV?.toLowerCase().includes('dev') || (!IS_PROD && !IS_TEST)
  const IS_CI = !!env.CI && !['f', 'false', '0', 'no', 'off'].includes(env.CI.toLowerCase())

  const defaults = {
    API_HOST: '0.0.0.0',
    API_PORT: 80,
    API_CORS_ORIGIN_REGEX: '^https?://(?:127\.0\.0\.1|localhost)(?::\d{1,5})?$',
    POSTGRES_URL: 'postgresql://postgres:password@postgres:5432/shadle',
    POSTGRES_TEST_URL: 'postgresql://postgres:password@localhost:5432/shadle_test',
    PUZZLE_SALT: 'default-salt',
    LOG_LEVEL: {
      CONSOLE: IS_PROD ? 'silent' : IS_DEV ? 'trace' : 'silent',
      FILE: IS_PROD ? 'info' : IS_DEV ? 'silent' : 'silent',
      MIN: IS_PROD ? 'info' : IS_DEV ? 'trace' : 'silent',
    },
  }

  return {
    IS_TEST,
    IS_PROD,
    IS_DEV,
    IS_CI,
    API_HOST: parsed.API_HOST || defaults.API_HOST,
    API_PORT: Number(parsed.API_PORT) || defaults.API_PORT,
    API_CORS_ORIGIN_REGEX: parsed.API_CORS_ORIGIN_REGEX || defaults.API_CORS_ORIGIN_REGEX,
    POSTGRES_URL: parsed.POSTGRES_URL || defaults.POSTGRES_URL,
    POSTGRES_TEST_URL: parsed.POSTGRES_TEST_URL || defaults.POSTGRES_TEST_URL,
    PUZZLE_SALT: IS_TEST ? defaults.PUZZLE_SALT : parsed.PUZZLE_SALT || defaults.PUZZLE_SALT,
    LOG_LEVEL: {
      CONSOLE: (parsed.LOG_LEVEL_CONSOLE || defaults.LOG_LEVEL.CONSOLE),
      FILE: (parsed.LOG_LEVEL_FILE || defaults.LOG_LEVEL.FILE),
      MIN: (parsed.LOG_LEVEL_MIN || defaults.LOG_LEVEL.MIN),
    },
  }
}

export default getConfig()
