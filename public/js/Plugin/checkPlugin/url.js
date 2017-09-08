class Url {
	// methods
	static checkURL(url){
		//判断URL是否符合规范
		if(!Url._IFURL.test(url)){
			return JSON.stringify({retcode: 2, msg: 'Request Not Url', res: '2'})
		}
	}
	//判断是否跨域
	static checkCros(url){
		let urlMatch = [], localMatch = [], urlLen, _location, localLen, flag = false, href = location.href
		if(!Url._IFURL.test(url) || !Url._IFURL.test(href)){
			return false
		}
		urlLen = (urlMatch = url.match(Url._IFURL)).length
		localLen = (localMatch = href.match(Url._IFURL)).length
		for (let i = urlLen - 2; i >= 1; i--) {
			if(urlMatch[i] !== localMatch[i]){
				flag = true
				break
			}
		}
		if(flag){
			return JSON.stringify({retcode: 3, msg: 'Cross domain', res: '3'})
		}
	}


}
Url._IFURL = /(http[s]?):\/\/([\w.]+)(:\d+)?([^?]*)/	
module.exports = Url