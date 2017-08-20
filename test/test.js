const DB = require('../js/db')
const assert = require('assert')

describe('DB', function() {
  it('可以设置options', function() {
    const options = {}
    const db = new DB(options)
    assert.equal(db.options, options)
  })

})