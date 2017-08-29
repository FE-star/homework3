const Tapable = require('tapable')
// const http = require('http')

class Request extends Tapable {
  constructor (url, options) {
    super()
    this.options = initOptions(url, options)
  }

  // request
  get (params) {
    this.options = Object.assign({}, this.options, params)
    this.applyPluginsAsyncWaterfall('options', this.options)
    return this.applyPluginsBailResult('get', this.options)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  }

  post () {

  }

  jsonp () {

  }
}

function initOptions (url, options) {
  var params = {}
  if (typeof url === 'string') {
    params.url = url
  }

  if (typeof options === 'object') {
    params = Object.assign({}, params, options)
  }

  return params
}

module.exports = Request
