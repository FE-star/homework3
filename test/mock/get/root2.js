module.exports = function (req, res) {
  res.end(JSON.stringify({
    retcode: 0,
    msg: 'OK',
    res: 'root 2 should updated'
  }))
}
