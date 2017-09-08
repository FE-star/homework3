const request = require('./XXX')
const db = request('http://localhost:9876/js/dest/dest.js')
const db6 = request('http://localhost:9876/js/dest/dest.js?no=11')
db6.get()
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
db.get({ err: 60000 })
  // 所以有缓存的时候，res应当立刻返回
  // 所以，res应当是上次的数据
	.done(function (res, flag) {
	    console.log(res)
	})
	.fail(function(res){
		console.log(res)
	})
	.catch(function(e){
		console.log(e)
	})
db.get({ maxAge: 60000 })
    // 所以有缓存的时候，res应当立刻返回
    // 所以，res应当是上次的数据
  .done(function (res, flag) {
      console.log(res)
  })
db.get({ data: { uin: 1234 }, lazy: true })
    // 所以有缓存的时候，res应当立刻返回
    // 所以，res应当是上次的数据
  .done(function (res, flag) {
      console.log(res)
  })

const db2 = request('http://y.stuq.com:9876/js/dest/dest.js')
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
const db3 = request('https://localhost:9876/js/dest/dest.js')
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
const  db4 = request('http://localhost:3001/js/dest/dest.js')
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


