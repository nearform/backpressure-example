const prometheus = require('prom-client')

const REQUEST_DURATION_MS = 200
const endTimer = Symbol('endTimer')

module.exports = async function (fastify) {
  const metric = new prometheus.Summary({
    name: 'http_request_duration_seconds',
    help: 'request duration summary in seconds',
    maxAgeSeconds: 60,
    ageBuckets: 5,
  })

  fastify.addHook('onRequest', async (req) => {
    req[endTimer] = metric.startTimer()
  })

  fastify.addHook('onResponse', async (req) => {
    req[endTimer] && req[endTimer]()
  })

  fastify.register(require('under-pressure'), {
    healthCheck() {
      const three9percentile = metric.get().values[6].value

      // four times the expected duration
      return three9percentile <= (REQUEST_DURATION_MS * 4) / 1e3
    },
    healthCheckInterval: 5000,
  })

  fastify.get('/slow', (_, reply) => {
    setTimeout(() => reply.send('hello world'), REQUEST_DURATION_MS)
  })
}
