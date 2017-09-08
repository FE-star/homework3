const request = require('../../js/XXX')
/**
 * 默认缓存模式,console.log会显示两遍
 */
const db = request('http://x.stuq.com:3000/js/dest/dest.js')
	db.get()
		.done(function(res){
			// 有缓存应该调用两遍
			console.log(res)
		})
		.fail(function(res){
			console.log(res)
		})
		.catch(function(e){
			console.log(e)
		})
