import process from 'node:process'
import { cleanupDb, getSql } from '@shadle/database'
import { describe } from 'manten'

await getSql()

await describe('server', async ({ runTestSuite }) => {
  runTestSuite(import('./basic.test'))
  runTestSuite(import('./guess-logic.test'))
  runTestSuite(import('./validation.test'))
  runTestSuite(import('./guess-api.test'))
  runTestSuite(import('./puzzle-attempts.test'))
  runTestSuite(import('./stats-utils.test'))
})

await cleanupDb()
process.exit(0)
