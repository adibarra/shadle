import { expect, testSuite } from 'manten'

export default testSuite(({ describe }) => {
  describe('basic', ({ test }) => {
    test('true should be true', () => {
      expect(true).toBe(true)
    })
  })
})
