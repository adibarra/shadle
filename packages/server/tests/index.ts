import process from 'node:process'
import { closeDb } from '@shadle/database'
import { describe } from 'manten'

await describe('server', async ({ runTestSuite }) => {
  runTestSuite(import('./basic.test'))
  runTestSuite(import('./guess-logic.test'))
  runTestSuite(import('./validation.test'))
  runTestSuite(import('./guess-api.test'))
  runTestSuite(import('./custom-puzzles.test'))
  runTestSuite(import('./puzzle-attempts.test'))
  runTestSuite(import('./stats-utils.test'))
})

await closeDb()
process.exit(0)
