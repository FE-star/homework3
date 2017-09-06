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
    // 4. catch error
    // 5. retcode !== 0
    let strategyPromise
    switch (cacheStrategy) {
      case 0:
        strategyPromise = useCacheInDefaultMode.call(this)
        break
      case 1:
        strategyPromise = useCacheInLazyMode.call(this)
        break
      case 2:
        strategyPromise = useCacheInMaxageMode.call(this)
        break
    }

    return strategyPromise
  }

  post (params) {
    this.options = Object.assign({}, this.options, params)
    this.options.method = 'POST'

    if (!this.options.url) {
      throw new Error('url cannot be empty')
    }

    this.applyPluginsBailResult('post', this.options)
    return this
  }

  jsonp (params) {
    this.options = Object.assign({}, this.options, params)

    const url = this.applyPluginsBailResult('url', this.options)
    var script = document.createElement('script')
    script.setAttribute('src', url)
    console.log('jsonp url: ', url)
    document.getElementsByTagName('head')[0].appendChild(script)
    return this
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
  const obj = JSON.parse(window.localStorage.getItem(key))
  this.flag = !!(!this.second && obj)
  // console.log('useCacheDeful: ', this.flag, obj)
  if (this.flag) {
    this.second = true
    setTimeout(() => {
      this.resolve(obj)
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
  const key = this.options.pathname && this.options.pathname.replace('/', '')
  const obj = JSON.parse(window.localStorage.getItem(key))
  // console.log('use lazy: ', obj)
  setTimeout(() => {
    this.resolve(obj)
  }, 50)

  this.applyPluginsBailResult('get', this.options)
  return this
}

function useCacheInMaxageMode () {
  const key = this.options.pathname && this.options.pathname.replace('/', '')
  const obj = JSON.parse(window.localStorage.getItem(key))
  this.flag = !!(obj && (Date.now() - obj.timestamp < this.options.maxAge))
  if (this.flag) {
    setTimeout(() => {
      this.resolve(obj)
    }, 100)
    return this
  }

  setTimeout(() => {
    this.applyPluginsBailResult('get')
  }, 100)
  return this
}

module.exports = Request
