import type { HealthResponse } from '@shadle/types'
import type { FastifyReply, FastifyRequest } from 'fastify'

export default {
  get: async (_request: FastifyRequest, _reply: FastifyReply): Promise<HealthResponse> => {
    return { status: 'ok', timestamp: new Date().toISOString() }
  },
}
