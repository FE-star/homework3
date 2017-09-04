var url = require('url')

function mockFactory (config) {
  const mockUrl = config.mockUriStart || '/'
  return function (req, res, next) {
    if (req.url.indexOf(mockUrl) === 0) {
      // console.log(req)
      // const path = req.url.slice(mockUrl.length)
      const method = req.method.toLowerCase()
      console.log(url.parse(req.url))
      const urlObj = url.parse(req.url)
      const distNum = urlObj.query.match(/.*?=(\d+)/) ? urlObj.query.match(/.*?=(\d+)/)[1] : ''
      try {
        // const processor = require(`./processors/${path}`)
        // console.log('req.method: ', req.method.toLowerCase())
        // console.log(`${path}`)
        // console.log(`./${path}/${req.method}`)
        const processor = require(`./${method}${urlObj.pathname}${distNum}`)
        processor(req, res)
      } catch (e) {
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
