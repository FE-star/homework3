const Tapable = require('tapable')

class Request extends Tapable {
  constructor (url, options) {
    super()
    this.options = initOptions(url, options)
  }

  // request
  get (params) {
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
