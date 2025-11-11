import type { HealthResponse } from '@shadle/types'
import type { FastifyPluginAsync } from 'fastify'

/**
 * Fastify route for the API health check endpoint.
 */
const route: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/', async (_request, reply): Promise<HealthResponse> => {
    return reply.code(200).send({ status: 'ok', timestamp: new Date().toISOString() })
  })
}

export default route
