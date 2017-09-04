const Request = require('../lib/request')
const assert = require('assert')
const http = require('http')
// const qs = require('querystring')

describe('Request', function () {
  describe('constructor', function () {
    it('可以设置 url 和 options', function () {
      const req = new Request('http://url.com', { type: 'GET' })
      assert.deepEqual(req.options, { url: 'http://url.com', type: 'GET' })
    })

    it('url 必须是字符串', function () {
      const req1 = new Request()
      const req2 = new Request({})
      const req3 = new Request(123)
      assert.deepEqual(req1.options, {})
      assert.deepEqual(req2.options, {})
      assert.deepEqual(req3.options, {})
    })

    it('options 必须是对象', function () {
      const req1 = new Request('http://url.com')
      const req2 = new Request()
      const req3 = new Request('http://url.com', 'aa')
      const req4 = new Request('http://url.com', 11)
      const req5 = new Request('http://url.com', { type: 'POST' })

      assert.deepEqual(req1.options, { url: 'http://url.com' })
      assert.deepEqual(req2.options, {})
      assert.deepEqual(req3.options, { url: 'http://url.com' })
      assert.deepEqual(req4.options, { url: 'http://url.com' })
      assert.deepEqual(req5.options, { url: 'http://url.com', type: 'POST' })
    })
  })

  describe('可以定制请求', function () {
    describe('GET 请求', function () {
      it('url 不能为空', function () {
        const req1 = new Request()
        const req2 = new Request('abc')

        assert.throws(req1.get, Error, 'Error thrown')
        assert.throws(req2.get, Error, 'Error thronw')
      })

      it('缓存策略不能同时为 lazy 和 maxAge', function () {
        const req = new Request('localhost', { path: '/root', maxAge: 10000, lazy: true })
        assert.throws(req.get, Error, 'lazy and maxAge cannot be defined at the same time')
      })

      describe('可以自定义 GET 请求', function () {
        describe('1. 默认缓存策略:', function () {
          class AA extends Request {
            constructor (url, options) {
              super(url, options)
              this.plugin('get', () => {
                const options = {
                  url: this.options.url,
                  path: `${this.options.pathname}?${this.options.query}`
                }
                const req = http.request(options, (resp) => {
                  resp.on('data', (chunk) => {
                    window.localStorage.setItem('root', JSON.parse(chunk.toString('utf8')).res)
                    this.resolve(JSON.parse(chunk.toString('utf8')))
                  })
                })

                req.end()
              })
            }
          }

          it('a. 如果没缓存，成功请求回调一次；', function (done) {
            const aa = new AA('localhost', { pathname: '/root', query: 'id=1' })
            aa
              .get()
              .done(res => {
                assert.deepEqual(res, {
                  retcode: 0,
                  msg: 'OK',
                  res: 'root1 resp'
                })
                done()
              })
          })

          it('b. 如果有缓存,请求成功缓存应当回调两次', function (done) {
            let times = 0
            const aaHasCache = new AA('localhost', { pathname: '/root', query: 'id=2' })
            aaHasCache
              .get()
              .done((res, isFromCache) => {
                times++
                if (times === 1) {
                  assert.deepEqual(res, 'root1 resp')
                }
                if (times === 2) {
                  assert.deepEqual(res, {
                    retcode: 0,
                    msg: 'OK',
                    res: 'root 2 should be updated'
                  })
                  window.localStorage.clear()
                  done()
                }
              })
          })
        })

        describe('2. lazy 策略：有缓存的情况下直接读取缓存，只有一次回调，但会发出请求', function () {
          class BB extends Request {
            constructor (url, options) {
              super(url, options)
              this.plugin('get', () => {
                const options = {
                  url: this.options.url,
                  path: `${this.options.pathname}?${this.options.query}`
                }
                const req = http.request(options, (resp) => {
                  resp.on('data', (chunk) => {
                    window.localStorage.setItem('root', JSON.parse(chunk.toString('utf8')).res)
                    // this.resolve(JSON.parse(chunk.toString('utf8')))
                  })
                })

                req.end()
              })
            }
          }

          it('a. 第一次请求没有缓存，应该为 null，但请求仍旧发出', function (done) {
            const aa = new BB('localhost', { pathname: '/root', query: 'id=1' })
            aa
              .get({ lazy: true })
              .done((res) => {
                // console.log('222AAA: ', res)
                assert.equal(res, null)
                done()
              })
          })

          it('b. 第二次请求有缓存，因此返回数据是第一次请求已发出，但未接收的数据', function (done) {
            const aaHasCache = new BB('localhost', { pathname: '/root', query: 'id=2' })
            aaHasCache
              .get({ lazy: true })
              .done((res) => {
                // console.log('222BBB: ', res)
                assert.equal(res, 'root1 resp')
                window.localStorage.clear()
                done()
              })
          })
        })
      })

      // after(function () {
      //   server.close()
      // })
    })
  })

  // TODO stuff
  // describe('边界处理及异常捕获', function () {

  // })
})
