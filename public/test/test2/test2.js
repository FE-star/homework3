const request = require('../../js/XXX')
const db = request('http://x.stuq.com:3000/js/dest/dest.js')
/**
 * data 参数是请求入参
 * lazy 标记懒更新
 */
db.get({ data: { uin: 1234 }, lazy: true })
    // 所以有缓存的时候，res应当立刻返回
    // 所以，res应当是上次的数据
  .done(function (res) {
      console.log(res)
  })

