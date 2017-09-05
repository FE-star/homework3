module.exports = function (req, res) {
  res.end(JSON.stringify({
    retcode: 2,
    msg: '404 not found. please check your url',
    res: null
  }))
}
