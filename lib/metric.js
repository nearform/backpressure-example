const prometheus = require('prom-client')

const metric = new prometheus.Summary({
  name: 'http_request_duration_seconds',
  help: 'request duration summary in seconds',
  maxAgeSeconds: 60,
  ageBuckets: 5,
})

metric.get999Percentile = () => {
  return metric.get().values[6].value
}

module.exports = metric
