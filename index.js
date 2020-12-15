'use strict'

const prometheus = require('prom-client')

module.exports = async function (fastify, options) {
  fastify.get('/metrics', (_, reply) => {
    reply.send(prometheus.register.metrics())
  })

  fastify.register(require('./slow'))
}
