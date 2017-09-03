function mockFactory (config) {
  const mockUrl = config.mockUriStart || '/'
  return function (req, res, next) {
    if (req.url.indexOf(mockUrl) === 0) {
      const path = req.url.slice(mockUrl.length)
      console.log('req.method: ', req.method)
      // console.log('ptah: ', path)
      try {
        // const processor = require(`./processors/${path}`)
        const processor = require(`./${path}`)
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
