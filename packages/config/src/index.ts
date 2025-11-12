import { env } from 'node:process'
import { PROJECT_ROOT_DIR } from '@shadle/constants'
import dotenv from 'dotenv'

/**
 * Schema for environment variables loaded from .env files.
 *
 * Used to type-check the configuration object returned by getConfig().
 */
interface DotEnvSchema {
  IS_PRODUCTION: boolean
  API_HOST: string
  API_PORT: number
  API_CORS_ORIGIN_REGEX: string
  POSTGRES_URL: string
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
    console.warn('Using default configuration values. This may not be suitable for production.')
  }

  const IS_PRODUCTION = env.NODE_ENV === 'production' || env.NODE_ENV === 'prod'

  const defaults = {
    API_HOST: '0.0.0.0',
    API_PORT: 80,
    API_CORS_ORIGIN_REGEX: '.*',
    POSTGRES_URL: '',
    LOG_LEVEL: {
      CONSOLE: IS_PRODUCTION ? 'silent' : 'trace',
      FILE: IS_PRODUCTION ? 'info' : 'silent',
      MIN: IS_PRODUCTION ? 'info' : 'trace',
    },
  }

  return {
    IS_PRODUCTION,
    API_HOST: parsed.API_HOST || defaults.API_HOST,
    API_PORT: Number(parsed.API_PORT) || defaults.API_PORT,
    API_CORS_ORIGIN_REGEX: parsed.API_CORS_ORIGIN_REGEX || defaults.API_CORS_ORIGIN_REGEX,
    POSTGRES_URL: parsed.POSTGRES_URL || defaults.POSTGRES_URL,
    LOG_LEVEL: {
      CONSOLE: parsed.LOG_LEVEL_CONSOLE || defaults.LOG_LEVEL.CONSOLE,
      FILE: parsed.LOG_LEVEL_FILE || defaults.LOG_LEVEL.FILE,
      MIN: parsed.LOG_LEVEL_MIN || defaults.LOG_LEVEL.MIN,
    },
  }
}

export default getConfig()
