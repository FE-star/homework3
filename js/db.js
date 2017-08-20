const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    super()
    this.options = options || {}
  }
}

module.exports = DB