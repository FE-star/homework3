class storageHandler {
	/*
	 *cache缓存模式, url访问地址, method访问方法, deferred延迟对象, time访问时间
	 *
	 */
	static DefaultHandle(cacheObj, reqObj, defer){
		const cache = storageHandler.cache = cacheObj[0], hasStoraged = storageHandler.hasStoraged = cacheObj[1], storage = cacheObj[2],
			  method = reqObj[0], url = reqObj[1], data = reqObj[2], queryStr = reqObj[3]
		//如果缓存模式是0.并且已经有缓存值,立即调用
		if(cache == 0){
			//先返回缓存值
			if(hasStoraged){
				defer.resolve(JSON.stringify(Object.assign(storage, {"res":"2", "msg":"Default Storage Strategy"})))
				storageHandler.request(method, url, data, defer, queryStr, {"res":"2", "msg":"Default Storage Strategy"})
			} else {
				//传入延迟对象,xhr正常访问回调并更新缓存值
				storageHandler.request(method, url, data, defer, queryStr, {"res":"1", "msg":"Default Storage Strategy"})
			}
		}  

	}

	static LazyHandle(cacheObj, reqObj, defer){
		const cache = storageHandler.cache = cacheObj[0], hasStoraged = storageHandler.hasStoraged = cacheObj[1], storage = cacheObj[2],
			  method = reqObj[0], url = reqObj[1], data = reqObj[2], queryStr = reqObj[3]
		if(cache == 1){
			if(hasStoraged){
				defer.resolve(JSON.stringify(Object.assign(storage, {"res":"2", "msg":"Lazy Storage Strategy"})) )
			} 
			//xhr正常访问回调并更新缓存值
			storageHandler.request(method, url, data, defer, queryStr, {"res":"1", "msg":"Lazy Storage Strategy"})
			
		}
	}

	static MaxAgeHandle(cacheObj, reqObj, defer){
		const cache = storageHandler.cache = cacheObj[0], hasStoraged = storageHandler.hasStoraged = cacheObj[1], storage = cacheObj[2],
			  method = reqObj[0], url = reqObj[1], data = reqObj[2], queryStr = reqObj[3], maxAge = reqObj[4] ? reqObj[4] : 0
		if(cache == 2){
			//是否已经有缓存对应值
			if(hasStoraged){
				//判断是否超时,还没超时直接返回缓存对象,已经超时了执行正常request访问并回调
				if( (Date.now() - storage['time']) < maxAge ){
					defer.resolve(JSON.stringify(Object.assign(storage, {"res":"2", "msg":"MaxAge Storage Strategy"})))
				} else {
				//如果已经超时了xhr正常访问回调并更新缓存值
					storageHandler.request(method, url, data, defer, queryStr, {"res":"1", "msg":"MaxAge Storage Strategy"})
				}
			} else {
				storageHandler.request(method, url, data, defer, queryStr, {"res":"1", "msg":"MaxAge Storage Strategy"})
			}
		}
	}

	static request(method, url, data, defer, queryStr, res){
		let req = new XMLHttpRequest, str, value
		try{
			req.onreadystatechange = ()=>{
				if (req.readyState === 4 && req.status === 200) {
					value = JSON.stringify(Object.assign( {}, JSON.parse(req.responseText), {time:Date.now()}, res))
					if(storageHandler.cache != 1 || !storageHandler.hasStoraged){
						//加上时间字段
						defer.resolve(value)
					}
					try{
						//先转换为字符,再写入缓存
						storageHandler.setStorage(queryStr, value, defer) 
					} catch(e){
						//TODO
						defer.showErr(JSON.stringify({"retcode":8,"msg":"localStorage Fulled","res":"1","time":Date.now()}))
						console.log(`${queryStr, value, defer}`)
						// decreaseStorage(queryStr, value, defer)
						// storageHandler.setStorage(queryStr, value, defer)
					}
				}
			}


			req.open(method, url, true)
			req.send(data)
		} catch(e){
			defer.showErr(e.toString())
		}
	}

	static getStorage(key){
		if(!window.localStorage){
			let _GET_COOKIE_ = new RegExp(key + "=(.+?)[;\\s]|"+key+"=([^;]+)$"), item = '', match
			if(_GET_COOKIE_.test(document.cookie)){
				match = document.cookie.match(_GET_COOKIE_)
				item = match[1] ? match[1] : match[2]
			}
			return item
		} else {
			return localStorage.getItem(key)
		}
	}

	static setStorage(key, value, defer){
		if(!window.localStorage){
			document.cookie = `${key}=${value}`
		} else {
			while(true){
				try{
					localStorage.setItem(key, value)
					break
				} catch(e){
					defer.showErr(JSON.stringify({"retcode":8,"msg":"localStorage Fulled","res":"1","time":Date.now()}))
					storageHandler.decreaseStorage()
					continue
					// storageHandler.setStorage(key, value, defer) 
				}
				
			}
		}
	}

	static decreaseStorage(){
		let i = 0, index = 0, minTime = 0, current, keys = Object.keys(localStorage), len = localStorage.length
		for(; i < len; i++){
			//localStorage填充进去的数据可能不符合规范
			try{
				current = JSON.parse( localStorage.getItem(keys[i])) 
			} catch(e){
				if(e instanceof SyntaxError){
					continue
				}				
			}
			if(typeof current === "object"){
				if(current["time"]){
					if(!minTime){
						minTime = current["time"]
						index = i
					} else {
						if(minTime > current["time"]){
							minTime = current["time"]
							index = i
						}

					}
				}
			}
		}
		localStorage.removeItem(keys[index])
	}
}
storageHandler.cache = -1
storageHandler.hasStoraged = false
module.exports = storageHandler