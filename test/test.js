const Request = require('../lib/request')
const assert = require('assert')
const http = require('http')
const qs = require('querystring')

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
                  const resVal = JSON.parse(chunk.toString('utf8'))
                  if (resVal.retcode === 0) {
                    window.localStorage.setItem('root', JSON.stringify({
                      'timestamp': Date.now(),
                      'res': resVal.res
                    }))
                    this.resolve(resVal)
                  }

                  if (resVal.retcode === 2) {
                    this.reject(resVal)
                  }
                })
              })

              req.end()
            })
          }
        }
        describe('1. 默认缓存策略:', function () {
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
                  assert.equal(res.res, 'root1 resp')
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
                    const resVal = JSON.parse(chunk.toString('utf8'))
                    window.localStorage.setItem('root', JSON.stringify({
                      'timestamp': Date.now(),
                      'res': resVal.res
                    }))
                  })
                })

                req.end()
              })
            }
          }

          it('a. 第一次请求没有缓存，应该为 null，但请求仍旧发出', function (done) {
            const bb = new BB('localhost', { pathname: '/root', query: 'id=1' })
            bb
              .get({ lazy: true })
              .done((res) => {
                // console.log('222AAA: ', res)
                assert.equal(res, null)
                done()
              })
          })

          it('b. 第二次请求有缓存，因此返回数据是第一次请求已发出，但未接收的数据', function (done) {
            const bbHasCache = new BB('localhost', { pathname: '/root', query: 'id=2' })
            bbHasCache
              .get({ lazy: true })
              .done((res) => {
                // console.log('222BBB: ', res)
                assert.equal(res.res, 'root1 resp')
                window.localStorage.clear()
                done()
              })
          })
        })

        describe('3. maxAge 策略：缓存里的数据小于maxAge，用缓存，不发请求；否则发请求', function () {
          class CC extends Request {
            constructor (url, options) {
              super(url, options)
              this.plugin('get', () => {
                const options = {
                  url: this.options.url,
                  path: `${this.options.pathname}?${this.options.query}`
                }
                const req = http.request(options, (resp) => {
                  resp.on('data', (chunk) => {
                    // window.localStorage.setItem('root', JSON.parse(chunk.toString('utf8')).res)
                    const resVal = JSON.parse(chunk.toString('utf8'))
                    window.localStorage.setItem('root', JSON.stringify({
                      'timestamp': Date.now(),
                      'res': resVal.res
                    }))
                    this.resolve(resVal)
                  })
                })

                req.end()
              })
            }
          }
          it('a. 数据存续小于 maxAge，使用缓存数据，不发出请求', function (done) {
            window.localStorage.setItem('root', JSON.stringify({
              'res': 'init value',
              'timestamp': Date.now()
            }))
            const cc = new CC('localhost', { pathname: '/root', query: 'id=1' })
            cc
              .get({ maxAge: 10000 })
              .done((res) => {
                // console.log('111CCC: ', res)
                assert.equal(res.res, 'init value')
                done()
              })
          })

          it('b. 否则发出请求，使用请求返回的数据', function (done) {
            const ccHasCache = new CC('localhost', { pathname: '/root', query: 'id=2' })
            ccHasCache
              .get({ maxAge: 100 })
              .done((res) => {
                // console.log('222CCC: ', res)
                assert.equal(res.res, 'root 2 should be updated')
                done()
              })
          })
        })

        it('请求失败，执行 fail 回调', function (done) {
          const ccShouldFail = new AA('localhost', { pathname: '/root', query: 'id=5' })
          ccShouldFail
            .get()
            .done(res => {
              // console.log('done cb: ', res)
              done()
            })
            .fail(e => {
              assert.deepEqual(e, {
                retcode: 2,
                msg: '404 not found. please check your url',
                res: null
              })
              done()
            })
        })
      })

      // after(function () {
      //   server.close()
      // })
    })

    describe('POST 请求', function () {
      it('url 不能为空', function () {
        const aa = new Request()
        assert.throws(aa.post, Error, 'url cannot be empty in POST request')
      })

      class MyPost extends Request {
        constructor (url, options) {
          super(url, options)
          this.plugin('post', () => {
            const postData = qs.stringify(this.options.data)
            const postOptions = {
              url: this.options.url,
              path: `${this.options.pathname}?${this.options.query}`,
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
              },
              method: this.options.method
            }
            const req = http.request(postOptions, (res) => {
              res.on('data', (chunk) => {
                // console.log('html res: ', chunk.toString('utf8'))
                const resObj = JSON.parse(chunk.toString('utf8'))
                if (resObj.retcode === 0) {
                  this.resolve(resObj)
                }

                if (resObj.retcode === 2) {
                  this.reject(resObj)
                }
              })
            })

            req.on('error', (chunk) => {
              console.log(chunk.toString('utf8'))
            })

            req.write(postData)
            req.end()
          })
        }
      }

      it('POST 成功，retcode === 0', function (done) {
        const aa = new MyPost('localhost', { pathname: '/root', query: 'id=1' })
        aa
          .post({ 'data': { 'key': 'abc', 'sentence': 'Hello my friend!' } })
          .done(res => {
            // console.log('my res is; ', res)
            assert.deepEqual(res, {
              retcode: 0,
              msg: 'OK',
              res: 'post root1 resp'
            })
            done()
          })
      })

      // retcode === 2, 客户端请求错误，打印错误 msg
      it('客户端错误引起的 POST 请求失败，retcode === 2', function (done) {
        const aa400 = new MyPost('localhost', { pathname: '/root', query: 'id=1' })
        const aa404 = new MyPost('localhost', { pathname: '/root', query: 'id=2' })
        aa400
          .post({ 'data': { 'key': 'abc' } })
          .done(res => {
            done()
          })
          .fail(e => {
            // console.log('fail cb 400: ', e)
            assert.deepEqual(e, {
              retcode: 2,
              msg: '400 invalid request, please check your post data',
              res: null
            })
            done()
          })

        aa404
          .post({ 'data': { 'key': 'abc', 'sentence': 'Hello my friend!' } })
          .done(res => {
            done()
          })
          .fail(e => {
            // console.log('fail cb 404: ', e)
            assert.deepEqual(e, {
              retcode: 2,
              msg: '404 not found. please check your url',
              res: null
            })
            done()
          })
      })

      // retcode === 3, 服务器错误，不会模拟
    })
  })

  // TODO stuff
  // 1. 前置一个 judge 插件，判断返回 retcode 是否为 0
  // 2. catch error
  // 4. localStorage 超出存储上限的情形
  // 5. 登录态检验，前置一个插件机制，让插件机制发现登陆态丢失了就呼起登录框或者执行某个动作
  // describe('边界处理及异常捕获', function () {

  // })
})
