import { cleanupDb, getSql } from '@shadle/database'
import { afterAll, beforeAll } from 'bun:test'

beforeAll(async () => {
  await getSql()
})

afterAll(async () => {
  await cleanupDb()
})
