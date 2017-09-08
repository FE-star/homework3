const request = require('../../js/XXX')

/**
 * 非HTTP[s]协议的URL访问,会报错
 */
const db = request('file://x.stuq.com:3000/js/dest/dest.js')
	db.get()
		.done(function(res){
			console.log(res)
		})
		.fail(function(res){
			console.log(res)
		})
		.catch(function(e){
			console.log(e)
	})
