module.exports = function (req, res) {
  res.end(JSON.stringify({
    retcode: 0,
    msg: 'OK',
    res: 'this is a test'
  }))
}
