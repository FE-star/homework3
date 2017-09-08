const request = require('../../js/XXX')
const db = request('http://localhost:9876/js/dest/dest.js')
/**
 * 缓存的最大生命是10s
 */
db.get({ maxAge: 10000 })
    /**
     * 所以10s内，请求是不会发送的，直接拿缓存的数据，
     * 但是超出了10s，则直接发出请求，那请求的数据
     */
    .done(function (res, flag) {
        console.log(res)
    })
