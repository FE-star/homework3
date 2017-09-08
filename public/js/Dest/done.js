// const request = require('../../js/XXX')
const URL = require('url');
const request = require('../XXX')
const assert = require('assert')
describe('默认缓存模式测试', function () {
	const db = request('http://x.stuq.com:3000/base/public/js/dest/dest.js')
	let rel1 = '', rel2 = '', time = 0
	beforeEach(function(done){
		db.get()
			.done(function(res){
				console.log(res)
				if(++time == 2){
					console.log(time)
					rel2 = res
					done()
				} else{
					console.log(time)
					rel1 = res
				}
			})
	})
	it('默认缓存模式下会返回两次数据', function(){
		let msg1 = JSON.parse(rel1), msg2 = JSON.parse(rel2)
		assert.deepEqual(msg1["retcode"],msg2["retcode"])
		assert.deepEqual(msg1["msg"],msg2["msg"])
		assert.deepEqual(msg1["res"],msg2["res"])
		assert.notEqual(msg1["time"],msg2["time"])
	})
})
describe('懒更新缓存模式测试', function () {
	const db = request('http://x.stuq.com:3000/base/public/js/dest/dest.js')
	let rel
	beforeEach(function(done){
		db.get({ "data": { uin: 1234 }, "lazy": true })
	    // 所以有缓存的时候，res应当立刻返回
	    // 所以，res应当是上次的数据
		  .done(function(res){
		  		rel = res
		  		console.log(res)
				done()
			})
			
	})
	it('懒缓存模式下两次返回数据是一样的', function(){
		let msg = JSON.parse(rel)
		assert.deepEqual(msg["retcode"],0)
		assert.deepEqual(msg["msg"],"Success")
		assert.deepEqual(msg["res"],"LazyHandle")
	})
})
describe('懒更新缓存模式测试', function () {
	const db = request('http://x.stuq.com:3000/base/public/js/dest/dest.js')
	let rel
	beforeEach(function(done){
		db.get({ "data": { uin: 1234 }, "lazy": true })
	    // 所以有缓存的时候，res应当立刻返回
	    // 所以，res应当是上次的数据
		  .done(function(res){
		  		rel = res
		  		console.log(res)
				done()
			})
			
	})
	it('懒缓存模式下两次返回数据是一样的', function(){
		let msg = JSON.parse(rel)
		assert.deepEqual(msg["retcode"],0)
		assert.deepEqual(msg["msg"],"Success")
		assert.deepEqual(msg["res"],"LazyHandle")
	})
})