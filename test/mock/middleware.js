var url = require('url')

function mockFactory (config) {
  const mockUrl = config.mockUriStart || '/'
  return function (req, res, next) {
    if (req.url.indexOf(mockUrl) === 0) {
      // const path = req.url.slice(mockUrl.length)
      const method = req.method.toLowerCase()
      // console.log(url.parse(req.url))
      const urlObj = url.parse(req.url)
      // const distNum = urlObj.query.match(/.*?=(\d+)/) ? urlObj.query.match(/.*?=(\d+)/)[1] : ''
      const distNum = urlObj.query.match(/.*?=(.*)/) ? urlObj.query.match(/.*?=(.*)/)[1] : ''
      try {
        const processor = require(`./${method}${urlObj.pathname}/${distNum}`)
        processor(req, res)
      } catch (e) {
        // console.log('requrie catch err: ', e)
        const notFoundHandler = require('./notFoundHandler')
        notFoundHandler(req, res)
        next()
      }
    } else {
      next()
    }
  }
}

// Instructions to use karma plugins
// http://karma-runner.github.io/1.0/config/plugins.html
module.exports = {
  'middleware:mock': ['factory', mockFactory]
}
