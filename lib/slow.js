const metric = require('./metric')

const REQUEST_DURATION_MS = 200
const endTimer = Symbol('endTimer')

function isHealthy() {
  // four times the expected duration
  return metric.get999Percentile() <= (REQUEST_DURATION_MS * 4) / 1e3
}

function canAcceptMoreRequests() {
  // twice the expected duration
  return metric.get999Percentile() <= (REQUEST_DURATION_MS * 2) / 1e3
}

const plugin = async function (fastify) {
  fastify.addHook('onRequest', async (req) => {
    req[endTimer] = metric.startTimer()
  })

  fastify.addHook('onResponse', async (req) => {
    req[endTimer] && req[endTimer]()
  })

  fastify.register(require('under-pressure'), {
    healthCheck() {
      return isHealthy()
    },
    healthCheckInterval: 5000,
  })

  fastify.get('/slow', (_, reply) => {
    setTimeout(() => reply.send('hello world'), REQUEST_DURATION_MS)
  })
}

plugin.canAcceptMoreRequests = canAcceptMoreRequests

module.exports = plugin
