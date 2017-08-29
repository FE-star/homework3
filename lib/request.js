const Tapable = require('tapable')
// const http = require('http')

class Request extends Tapable {
  constructor (url, options) {
    super()
    this.options = initOptions(url, options)
  }

  // request
  get (params) {
    // if (typeof params === 'object') {
    //   this.options = Object.assign({}, this.options, params)
    // }

    // const url = this.options.url
    // const port = this.options.port
    // if (!url) {
    //   throw new Error('url 不能为空')
    // }

    // return new Promise((resolve, reject) => {
    //   const xhrOptions = {
    //     url: this.options.url,
    //     port: 3000
    //   }

    //   const xhr = http.request(xhrOptions, function (res) {
    //     // console.log('receiving res')
    //     res.on('data', (chunk) => {
    //       // console.log(`${chunk}`)
    //       // console.log('=================')
    //       resolve(chunk.toString('utf8'))
    //     })
    //   })

    //   xhr.end()
    // })

    return this.applyPluginsBailResult('get')
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
