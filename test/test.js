const request = require('../lib/request')
const assert = require('assert')

describe('request', function() {
  describe('constructor', function() {
    it('可以设置 url 和 options', function() {
      const req = new request('http://url.com', { type: 'GET' })
      assert.deepEqual(req.options, { url: 'http://url.com', type: 'GET' })
    })

    it('url 必须是字符串', function() {
      const req1 = new request()
      const req2 = new request({})
      const req3 = new request(123)
      
      assert.deepEqual(req1.options, {})
      assert.deepEqual(req2.options, {})
      assert.deepEqual(req3.options, {})
    })

    it('options 必须是对象', function() {
      const req1 = new request('http://url.com')
      const req2 = new request()
      const req3 = new request('http://url.com', 'aa')
      const req4 = new request('http://url.com', 11)
      const req5 = new request('http://url.com', { type: 'POST' })

      assert.deepEqual(req1.options, { url: 'http://url.com' })
      assert.deepEqual(req2.options, {})
      assert.deepEqual(req3.options, { url: 'http://url.com' })
      assert.deepEqual(req4.options, { url: 'http://url.com' })
      assert.deepEqual(req5.options, { url: 'http://url.com', type: 'POST' })
      
    })
  })
})