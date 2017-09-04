const Tapable = require('tapable')

class Request extends Tapable {
  constructor (url, options) {
    super()
    this.options = initOptions(url, options)
    this.doneCbs = []
    this.failCbs = []
    this.catchCbs = []
  }

  trigger (callbacks, args) {
    callbacks.forEach(cb => {
      try {
        cb.call(this, args)
      } catch (error) {
        this.trigger(this.catchCbs, error)
      }
    })

    return this
  }

  resolve (args) {
    this.trigger(this.doneCbs, args)
    return this
  }

  reject (args) {
    this.trigger(this.failCbs, args)
    return this
  }

  done (fn) {
    this.doneCbs.push(fn)
    return this
  }

  fail (fn) {
    this.failCbs.push(fn)
    return this
  }

  catch (fn) {
    this.catchCbs.push(fn)
    return this
  }

  // request
  get (params) {
    this.options = Object.assign({}, this.options, params)

    if (!this.options.url) {
      throw new Error('url cannot be empty')
    }

    const cacheStrategy = pickupCacheStrategy(this.options)
    if (typeof cacheStrategy === 'string') {
      throw new Error(cacheStrategy)
    }

    // TODO:
    // 1. default case, which is strategy 0
    // 2. lazy case: which is strategy 1
    // 3. maxAge case: which is strategy 2
    // 4. catch error
    // 5. retcode !== 0
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
  const key = this.options.pathname && this.options.pathname.replace('/', '')
  const value = window.localStorage.getItem(key)
  this.flag = !!(!this.second && value)
  console.log('useCacheDeful: ', this.flag, value)
  if (this.flag) {
    this.second = true
    setTimeout(() => {
      this.resolve(value)
      useCacheInDefaultMode.call(this)
    }, 50)
    return this
  }

  this.second = false
  setTimeout(() => {
    this.applyPluginsBailResult('get', this)
  }, 100)

  return this
}

function useCacheInLazyMode () {
}

function useCacheInMaxageMode () {
}

module.exports = Request
