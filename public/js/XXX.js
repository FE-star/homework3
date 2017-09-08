let DB = require('./Plugin/DB')

function request(url){
	return new DB(url)
}

module.exports = request