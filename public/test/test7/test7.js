const request = require('../../js/XXX')

/**
 * 错误的缓存请求模式,会报错
 */
const db = request('http://localhost:9876/js/dest/dest.js')
		db.get({ err: 60000 })
		.done(function (res) {
		    console.log(res)
		})
		.fail(function(res){
			console.log(res)
		})
		.catch(function(e){
			console.log(e)
	})	