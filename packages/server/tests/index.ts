import { describe } from 'manten'

await describe('server', async ({ runTestSuite }) => {
  runTestSuite(import('./basic.test'))
  runTestSuite(import('./stats-utils.test'))
})
