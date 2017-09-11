const request = require('../public/js/XXX')
const assert = require('assert')
describe('默认缓存模式测试', function () {
	const db = request('http://localhost:9876/dest/dest.js')
	let msg1 = {}, msg2 = {}, time = 0
	before(function(){
		document.cookie = 'uid=Mr.Right'
	})
	it('默认缓存模式下,首次访问只会返回一次结果,之后的访问会返回两次数据', function(done){
		db.get()
			.done(function(res){
				console.log(res)
				const msg = JSON.parse(res)
				if(msg["res"] == 1 ){
					assert.deepEqual(msg["msg"], 'Default Storage Strategy')
					assert.deepEqual(msg["retcode"], 0)
					done()
				} else if(msg["res"] == 2){
					if(++time == 1){
						msg1 = msg
					} else{
						msg2 = msg
						assert.deepEqual(msg1["res"], 2)
						assert.deepEqual(msg1["retcode"],msg2["retcode"])
						assert.deepEqual(msg1["msg"],msg2["msg"])
						assert.deepEqual(msg1["res"],msg2["res"])
						assert.notEqual(msg1["time"],msg2["time"])
						done()
					}
				}
				
			})
	})
})
describe('懒更新缓存模式测试', function () {
	const db = request('http://localhost:9876/dest/dest.js')
	let msg1 = {}, msg2 = {}, time = 0
			
	it('懒缓存模式下第一次和第二次返回数据是一样的', function(done){
		db.get({ "data": { uin: 1234 }, "lazy": true })
	    // 没有缓存的时候，应当访问服务器,res立刻返回
		  .done(function(res){
		  		console.log(res)
				const msg = JSON.parse(res)
				if(msg["res"] == 1 ){
					assert.deepEqual(msg["msg"], 'Lazy Storage Strategy')
					assert.deepEqual(msg["retcode"], 0)
					msg1 = msg
					++time
					done()
				} 
			})
		db.get({ "data": { uin: 1234 }, "lazy": true })
	    // 当第二次访问时,因为已经缓存了第一次访问的数据，
	    // 所以，res应当是上次的数据
		  .done(function(res){
		  		console.log(res)
				const msg = JSON.parse(res)
				if(msg["res"] == 2){
					if(++time == 2){
						msg2 = msg
						assert.deepEqual(msg1, msg1)
					}
					done()
				}
			})

	})
})
describe('maxAge缓存模式测试', function () {
	const db = request('http://localhost:9876/dest/dest.js')
	let msg1 = {}, msg2 = {}, msg3 = {}

	before(function(done){
		db.get({ maxAge: 10 })
		     // 第一次请求,缓存里没有数据,所以res为1
		    .done(function (res) {
		        console.log(res)
		        const msg = JSON.parse(res)
				assert.deepEqual(msg["msg"], 'MaxAge Storage Strategy')
				assert.deepEqual(msg["retcode"], 0)
				assert.deepEqual(msg["res"], 1)
				msg1 = msg
				done()
		    })
		
	})

	it('maxAge缓存模式测试缓存模式下生命周期内返回数据除了res字段,其他都是一样的', function(done){
		setTimeout(()=>{
			//在1秒内又执行一边
			db.get({ maxAge: 500 })
			      // 第二次执行,生命周期是500毫秒,上一次请求超出了期限,
			      // 所以直接发出请求，那请求的数据跟第一次不相等,并且res字段为1
			    .done(function (res) {
			        console.log(res)
			        const msg = JSON.parse(res)
					msg2 = msg
					assert.deepEqual(msg["msg"], 'MaxAge Storage Strategy')
					assert.deepEqual(msg["retcode"], 0)
					assert.deepEqual(msg["res"], 1)
					assert.notEqual(msg1, msg2)
					done()
			    })
		}, 1000)
	})

	after(function(done){
		setTimeout(()=>{
			//在1秒内又执行一边
			db.get({ maxAge: 2000 })
			      // 第三次执行,生命周期是2秒,所以msg2是在生命周期内,直接抓取缓存数据
			      // 所以msg3的res状态是2,并且其他字段 都跟msg2一样
			    .done(function (res) {
			        console.log(res)
			        const msg = JSON.parse(res)
					msg3 = msg
					assert.deepEqual(msg3["msg"], msg2["msg"])
					assert.deepEqual(msg3["retcode"], msg2["retcode"])
					assert.deepEqual(msg3["time"], msg2["time"])
					assert.deepEqual(msg3["res"], 2)
					done()
			    })
		}, 1000)
		
	})

})

describe('撑爆localStorage测试', function () {
	const db = request(`http://localhost:9876/dest/dest.js?no=${Date.now()}`)
	let msg1 = {}, msg2 = {}, time = 0
	before(function(){
		try{
			for(let i = 0; i < 500000; i++){
				localStorage.setItem(`name${i}`, JSON.stringify({"retcode":0,"msg":"test","time":Date.now()} ))
			} 
		} catch(e){
			console.log('localStorage已经填满')
		}
	})
	it('填充数据撑爆localStorage,测试能否正常运行', function(done){
		db.get()
		.done(function (res) {
		    console.log(res)
		    const msg = JSON.parse(res)
		    assert.deepEqual(msg["msg"], 'Default Storage Strategy')
			assert.deepEqual(msg["retcode"], 0)
			assert.deepEqual(msg["res"], 1)
		    done()
		})
		.catch(function(e){
			console.log(e)
		    assert.deepEqual(msg["msg"], 'localStorage Fulled')
			assert.deepEqual(msg["retcode"], 8)
			assert.deepEqual(msg["res"], 1)		
			done()
		})	
		
	})
	after(function(){
		localStorage.clear()
	})
})
describe('测试登陆台丢失', function () {
	const db = request(`http://localhost:9876/dest/dest.js`)
	let msg1 = {}, msg2 = {}, time = 0
	before(function(done){
		var delete_cookie = function(name) {
		    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		}
		delete_cookie('uid')
		db.get()
		    .fail(function (res) {
		        console.log(res)
				const msg = JSON.parse(res)
				assert.deepEqual(msg["msg"], 'Login Off')
				assert.deepEqual(msg["retcode"], 1)
				assert.deepEqual(msg["res"], 7)
		        done()
		 })
	})
	it('测试登陆台丢失', function(done){
		document.cookie = 'uid=Mr.Right'
		db.get()
		.done(function (res) {
		    console.log(res)
		    done()
		})
		.catch(function(e){
			console.log(e)
			done()
		})	
		
	})
})

describe('跨域测试,没有设置JSONP,会报错', function () {
	it('跨域测试-域名测试', function(done){
		const db2 = request('http://y.stuq.com:9876/js/dest/dest.js')
		db2.get()
			.done(function(res){
				console.log(res)
			})
			.fail(function(res){
				console.log(res)
				const msg = JSON.parse(res)
				assert.deepEqual(msg["msg"], 'Cross domain')
				assert.deepEqual(msg["retcode"], 3)
				assert.deepEqual(msg["res"], 3)
				done()
			})
			.catch(function(e){
				console.log(e)
		})
	})
	it('跨域测试-协议不同', function(done){
		const db3 = request('https://localhost:9876/js/dest/dest.js')
		db3.get()
			.done(function(res){
				console.log(res)
			})
			.fail(function(res){
				console.log(res)
				const msg = JSON.parse(res)
				assert.deepEqual(msg["msg"], 'Cross domain')
				assert.deepEqual(msg["retcode"], 3)
				assert.deepEqual(msg["res"], 3)
				done()
			})
			.catch(function(e){
				console.log(e)
		})
	})

	it('跨域测试-端口不同', function(done){
		const  db4 = request('http://localhost:3001/js/dest/dest.js')
		db4.get()
			.done(function(res){
				console.log(res)
			})
			.fail(function(res){
				console.log(res)
				const msg = JSON.parse(res)
				assert.deepEqual(msg["msg"], 'Cross domain')
				assert.deepEqual(msg["retcode"], 3)
				assert.deepEqual(msg["res"], 3)
				done()
			})
			.catch(function(e){
				console.log(e)
		})
	})
})
describe('URL测试', function () {
	it('不是URL,会报错', function(done){
		const db = request('file://localhost:9876/js/dest/dest.js')
		db.get()
			.done(function(res){
				console.log(res)
			})
			.fail(function(res){
				console.log(res)
				const msg = JSON.parse(res)
				assert.deepEqual(msg["msg"], 'Request Not Url')
				assert.deepEqual(msg["retcode"], 2)
				assert.deepEqual(msg["res"], 2)
				done()
			})
			.catch(function(e){
				console.log(e)
		})
	})
})
describe('Get参数测试', function () {
	it('Get参数测试', function(done){
		const db = request('http://localhost:9876/js/dest/dest.js')
			db.get({ err: 60000 })
			.done(function (res) {
			    console.log(res)
			})
			.fail(function(res){
				console.log(res)
				const msg = JSON.parse(res)
				assert.deepEqual(msg["msg"], 'Wrong Cache Module')
				assert.deepEqual(msg["retcode"], 4)
				assert.deepEqual(msg["res"], 4)
				done()
			})
			.catch(function(e){
				console.log(e)
		})	
	})
})
