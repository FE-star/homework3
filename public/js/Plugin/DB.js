let Tapable = require('./tapable'),
	urlHandler = require('./checkPlugin/url'),
	storageHandler = require('./storagePlugin/storageHandler'),
	checkHandler = require('./checkPlugin/checkHandler'),
	deferred = require('./deferredPlugin/Deferred'),
	urlModule = require('url'),
	pathModul = require('path'),
	querystring = require('querystring')
class DB extends Tapable{
	constructor(url){
		super()
		//注册插件
		//检查访问的URL是否符合规范或者是否跨域
		this.plugin('checkURL',urlHandler.checkURL)
		this.plugin('checkURL',urlHandler.checkCros)
		this.plugin('preCheckLogin',checkHandler.preCheckLogin)
		this.plugin('preCheckData', checkHandler.preCheckData)
		this.plugin('ajaxRequest', storageHandler.DefaultHandle)
		this.plugin('ajaxRequest', storageHandler.LazyHandle)
		this.plugin('ajaxRequest', storageHandler.MaxAgeHandle)
		//存储访问的url地址
		this.urlObj = urlModule.parse(url)
		this.url = this.urlObj["hostname"]
		this.queryStr = ''
		this.cros = false
		this.isUrl = true
		this.cache = 0
		this.storage = {}
		this.hasStoraged = false
		this.data =  this.url && this.urlObj["query"] ? this.urlObj["query"] : ''
		this.pathname =  url && this.urlObj["pathname"] ? this.urlObj["pathname"] : '/'
		this.port =  this.url && this.urlObj["port"] ? this.urlObj["port"] : 3000
	}

	get(args){
		let data = args && args["data"] ? (this.data = querystring.stringify(args["data"]) ) : this.data ,
		    pathname = args && args["pathname"] ? (this.pathname = args["pathname"]) : this.pathname, 
		    port = args && args["port"] ? (this.port = args["port"]) : this.port, 
		    search = this.urlObj["query"] ?  this.urlObj["search"] : (data?data:''),
		    hostname = this.url, protocol = this.urlObj["protocol"],
		    //根据入参拼接新的href
		    href = urlModule.format({hostname, pathname, port, protocol, search}),
		    maxAge = args && args["maxAge"] ,
		    preCheck = '',
		    defer = new deferred()
		//判断访问的URL地址是否符合规范,如果不是返回拒绝状态的Deferred
		if(preCheck = this.applyPluginsBailResult('checkURL', href) ){
			defer.reject(preCheck)
			return defer
		} 
		//判断传入的缓存模式是否规范
		if( (this.cache = this.applyPluginsBailResult('preCheckData', args) ) < 0 ){
			defer.reject(JSON.stringify({retcode: 4, msg: 'Wrong Cache Module', res: '4'}))
			return defer
		}
		//确认登陆台是否丢失
		if(preCheck = this.applyPluginsBailResult('preCheckLogin')){
			defer.reject(preCheck)
			return defer
		}
		//判断是否已经缓存了请求参数及对应的返回值
		this.hasStoraged = false
		//判断是否已经缓存了指定入参
		this.queryStr = JSON.stringify({pathname, data})
		if(window.localStorage.getItem(this.queryStr)){
			this.hasStoraged = true
			this.storage = JSON.parse( window.localStorage.getItem(this.queryStr))
		}

		//传入缓存模式、请求地址、访问Method、Deferred对象,调用异步请求插件进行访问
		//访问之后缓存返回值
		this.applyPluginsBailResult('ajaxRequest',[this.cache, this.hasStoraged, this.storage], ['GET', href, null, this.queryStr, maxAge], defer)
    	return defer
	}

}

module.exports = DB