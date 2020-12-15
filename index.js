'use strict'

const { TooManyRequests } = require('http-errors')
const prometheus = require('prom-client')

const slow = require('./lib/slow')

module.exports = async function (fastify, options) {
  fastify.get('/metrics', (_, reply) => {
    reply.send(prometheus.register.metrics())
  })

  fastify.get('/liveness', async () => {
    return 'OK'
  })

  fastify.get('/readiness', async () => {
    if (slow.canAcceptMoreRequests()) {
      return 'OK'
    }

    throw new TooManyRequests('Unable to accept new requests')
  })

  fastify.register(slow)
}
