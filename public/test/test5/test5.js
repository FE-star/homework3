const request = require('../../js/XXX')

/**
 * 跨域测试,没有设置JSONP,会报错
 */
const db2 = request('http://y.stuq.com:3000/js/dest/dest.js')
	db2.get()
		.done(function(res){
			console.log(res)
		})
		.fail(function(res){
			console.log(res)
		})
		.catch(function(e){
			console.log(e)
	})
const db3 = request('https://x.stuq.com:3000/js/dest/dest.js')
	db3.get()
		.done(function(res){
			console.log(res)
		})
		.fail(function(res){
			console.log(res)
		})
		.catch(function(e){
			console.log(e)
	})
const  db4 = request('http://x.stuq.com:3001/js/dest/dest.js')
	db4.get()
		.done(function(res){
			console.log(res)
		})
		.fail(function(res){
			console.log(res)
		})
		.catch(function(e){
			console.log(e)
	})