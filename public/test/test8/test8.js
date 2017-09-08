const request = require('../../js/XXX')

/**
 * localStorage清除缓存策略,先填满localStorage,然后访问没有缓存过的地址,会提示报错,但是会执行清除缓存策略,
 * 将数据存入localStorage
 */
try{
	for(let i = 0; i < 500000; i++){
		localStorage.setItem(`name${i}`, JSON.stringify({"retcode":0,"msg":"test","time":Date.now()} ))
	} 
} catch(e){
	console.log('localStorage已经填满')
}

const db = request(`http://x.stuq.com:3000/js/dest/dest.js?no=${Date.now()}`)
		db.get()
		.done(function (res) {
		    console.log(res)
		})
		.fail(function(res){
			console.log(res)
		})
		.catch(function(e){
			console.log(e)
	})	