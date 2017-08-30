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
    // this.applyPluginsBailResult('options', this.options)

    if (!this.options.url) {
      throw new Error('url cannot be empty')
    }

    const cacheStrategy = pickupCacheStrategy(this.options)
    if (typeof cacheStrategy === 'string') {
      return Promise.resolve(cacheStrategy)
    }

    // TODO:
    // 1. catch error
    // 2. retcode !== 0
    let strategyPromise
    switch (cacheStrategy) {
      case 0:
        strategyPromise = useCacheInDefaultMode.call(this)
        break
      case 1:
        strategyPromise = useCacheInLazyMode()
        break
      case 2:
        strategyPromise = useCacheInMaxageMode()
        break
    }

    return strategyPromise
    // return this.applyPluginsBailResult('get', this.options)
    //   .then(res => {
    //     return Promise.resolve(res)
    //   })
    //   .catch(err => {
    //     return Promise.reject(err)
    //   })
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

function pickupCacheStrategy (options) {
  let strategy = 0
  if (options.lazy && options.maxAge) return 'cache strategy CANNOT include both lazy and maxAge'
  strategy = options.lazy ? 1 : strategy
  strategy = options.maxAge ? 2 : strategy
  return strategy
}

function useCacheInDefaultMode () {
  return this.applyPluginsBailResult('get', this.options)
    .then(res => {
      // console.log('res: ', res)
      return Promise.resolve(res)
    })
    .catch(err => {
      return Promise.reject(err)
    })
}

function useCacheInLazyMode () {
}

function useCacheInMaxageMode () {
}

module.exports = Request
