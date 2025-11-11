import type { Logger as PinoLogger } from 'pino'
import config from '@shadle/config'
import { LOGS_DIR } from '@shadle/constants'
import pino from 'pino'

const loggers = new Map<string | undefined, Logger>()

/**
 * Logger type alias for the Pino logger instance.
 */
export type Logger = PinoLogger<never>

/**
 * Interface for objects that optionally include a logger instance.
 */
export interface OptionalLogger {
  logger?: Logger
}

/**
 * Interface for objects that require a logger instance.
 */
export interface HasLogger {
  logger: Logger
}

/**
 * Returns a logger instance with an optional prefix and parent logger.
 *
 * If a logger with the same prefix exists, returns the cached instance.
 *
 * @param prefix - Optional prefix for log messages.
 * @param parent - Optional parent logger to create a child logger from.
 * @returns A logger instance.
 */
export function getLogger(prefix?: string, parent?: Logger): Logger {
  if (loggers.has(prefix))
    return loggers.get(prefix)!

  if (typeof parent !== 'undefined')
    return getChildLogger(prefix ?? '', parent)

  return createLogger(prefix)
}

/**
 * Creates a logger instance with the specified prefix.
 *
 * @param prefix - Optional prefix for log messages.
 * @returns A logger instance.
 */
function createLogger(prefix?: string): Logger {
  return pino({
    level: config.LOG_LEVEL.MIN,
    transport: {
      targets: [
        {
          target: 'pino-pretty',
          level: config.LOG_LEVEL.FILE,
          options: {
            colorize: false,
            destination: `${LOGS_DIR}/app.log`,
            translateTime: 'UTC:yyyy-mm-dd"T"HH:MM:ss',
            singleLine: true,
            mkdir: true,
          },
        },
        {
          target: 'pino-pretty',
          level: config.LOG_LEVEL.CONSOLE,
          options: {
            colorize: true,
            translateTime: 'UTC:yyyy-mm-dd"T"HH:MM:ss',
            singleLine: true,
          },
        },
      ],
    },
    base: undefined,
    msgPrefix: prefix ? `[${prefix}] ` : undefined,
    serializers: {
      req: req => ({ url: req.url }),
      res: res => ({ code: res.statusCode }),
      responseTime: (time: number) => `${Math.round(time)}ms`,
    },
  })
}

/**
 * Creates a child logger from a parent logger with a prefix.
 *
 * @param prefix - The prefix for the child logger.
 * @param parentLogger - The parent logger to create a child from.
 * @returns A child logger instance.
 */
function getChildLogger(prefix: string, parentLogger: Logger): Logger {
  return parentLogger.child({}, {
    msgPrefix: `[${prefix}] `,
  })
}
