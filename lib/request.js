const Tapable = require('tapable')
const http = require('http')

class Request extends Tapable {
  constructor (url, options) {
    super()
    this.options = initOptions(url, options)
  }

  // request
  get (params) {
    if (typeof params === 'object') {
      this.options = Object.assign({}, this.options, params)
    }

    const url = this.options.url
    if (!url) {
      throw new Error('url 不能为空')
    }

    return new Promise((resolve, reject) => {
      const xhrOptions = {
        url: this.options.url
      }

      const xhr = http.request(xhrOptions, function (res) {
        console.log('receiving res')
        resolve(res)
      })

      console.log('end')
      xhr.end()
      console.log('=============')
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
