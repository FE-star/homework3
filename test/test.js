const Request = require('../lib/request')
const assert = require('assert')
const http = require('http')

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

      // before(function () {
      //   app.get('/', function (req, res) {
      //     res.json({
      //       retcode: 0,
      //       msg: 'OK',
      //       res: 'this is a test'
      //     })
      //   })
      // })

      describe('可以自定义 GET 请求', function () {
        it('retcode 为 0，请求成功', function (done) {
          class AA extends Request {
            constructor (url, options) {
              super(url, options)
              this.plugin('get', () => {
                return new Promise((resolve, reject) => {
                  const req = http.request(this.options, function (resp) {
                    resp.on('data', (chunk) => {
                      console.log(chunk.toString('utf8'))
                      resolve(chunk)
                    })
                  })

                  req.end()
                })
              })
            }
          }

          const aa = new AA('localhost', { path: '/root' })
          aa.get().then(buf => {
            const jsonResult = JSON.parse(buf.toString('utf8'))
            assert.deepEqual(jsonResult, {
              retcode: 0,
              msg: 'OK',
              res: 'this is a test'
            })

            done()
          })
        })
      })

      describe('localStorage 缓存: ', function () {
        it('1. 默认缓存策略: 如果没缓存，成功请求回调一次，如果有缓存,请求成功缓存应当回调两次，', function (done) {

        })
      })

      // after(function () {
      //   server.close()
      // })
    })
  })
})
