class checkHandler {
	static preCheckData(data){
		let flag = -1
		if(!data || (typeof data === 'object' && Object.keys(data).length === 0)){
			flag = 0
		} else if(data['lazy']){
			flag = 1
		} else if(data['maxAge']){
			flag = 2
		} 
		return flag
	}

	static preCheckLogin(){
		const _LOGIN = /uid=(.+?)[;\s]?/
		if(!document.cookie || !_LOGIN.test(document.cookie)){
			return JSON.stringify({retcode: 1, msg: 'Login Off', res: '7'})
		}
	}

}
module.exports = checkHandler