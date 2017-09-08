let callbackQueues = require('./callbackQueues')
class Deferred {
	constructor(){
		this.fails = new callbackQueues()
		this.succes = new callbackQueues()
		this.errors = new callbackQueues()
	}
	//resolve方法,将回调或者回调结果压入队列
	resolve(){
		this.succes.add(arguments.slice? arguments.slice() : arguments)
	}
	//统一执行所有队列
	done(fn){
		this.succes.fireWith(this.succes, fn)
		return this
	}
	//reject方法,将回调或者回调结果压入队列
	reject(fn){
		this.fails.add(arguments.slice? arguments.slice() : arguments)
	}
	//统一执行所有队列
	fail(fn){
		this.fails.fireWith(this.fails, fn)
		return this
	}
	//showErr方法,将回调或者回调结果压入队列
	showErr(fn){
		this.errors.add(arguments.slice? arguments.slice() : arguments)
	}
	//统一执行所有队列
	catch(fn){
		this.errors.fireWith(this.errors, fn)
		return this
	}
}
module.exports = Deferred