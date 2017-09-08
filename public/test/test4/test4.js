const request = require('../../js/XXX')
const db = request('http://localhost:9876/js/dest/dest.js')

/**
 * 登陆台丢失,系统里的uid cookie只存在20秒,20秒之后重新运行会提示登陆台丢失
 */
var delete_cookie = function(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
delete_cookie('uid')
db.get()
    .fail(function (res) {
        console.log(res)
        // 值为1，调用1次
        // 因为懒得每次fail都要看看是否登陆台丢失，
        // 所以应当在一个共用的地方处理掉登陆态
        // 比如前置一个插件机制，让插件机制发现登陆态丢失了就呼起登录框
    })