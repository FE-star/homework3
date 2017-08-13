const request = require('../')
const xxx = request('http://xxx')
    
/**
 * .get() 调用 GET 请求
 * .post() 调用 POST 请求
 * .jsonp() 调用JSONP 请求
 */
xxx.get()
    /**
     * res: 成功回调的返回结果
     * flag: 是否来自缓存，用于判断
     */
    .done(function (res, flag) {
        // 有缓存应该调用两遍
        console.log(res)
    })
    .fail(function (res) {
        // 失败了应该告诉失败原因
        console.log(res)
    })
    .catch(function (e) {
        // 出错了应当能捕获错误
        console.error(e)
    })

/**
 * data 参数是请求入参
 * lazy 标记懒更新
 */
xxx.get({ data: { uin: 1234 }, lazy: true })
    // 所以有缓存的时候，res应当立刻返回
    // 所以，res应当是上次的数据
    .done(function (res, flag) {
        console.log(res)
    })

/**
 * 缓存的最大生命是10s
 */
xxx.get({ maxAge: 10000 })
    /**
     * 所以10s内，请求是不会发送的，直接拿缓存的数据，
     * 但是超出了10s，则直接发出请求，那请求的数据
     */
    .done(function (res, flag) {
        console.log(res)
    })

/**
 * fail逻辑
 */
// 相当于清除登陆态，所以后台应当返回retcode=1
document.cookie = ''

xxx.get()
    .fail(function (res) {
        res.retcode // 值为1，调用1次
        // 因为懒得每次fail都要看看是否登陆台丢失，
        // 所以应当在一个共用的地方处理掉登陆态
        // 比如前置一个插件机制，让插件机制发现登陆态丢失了就呼起登录框
    })