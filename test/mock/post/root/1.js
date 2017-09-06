const qs = require('querystring')

module.exports = function (req, res) {
  req.on('data', (chunk) => {
    const body = qs.parse(chunk.toString('utf8'))
    if (body.key && body.sentence) {
      res.end(JSON.stringify({
        retcode: 0,
        msg: 'OK',
        res: 'post root1 resp'
      }))
    } else {
      res.end(JSON.stringify({
        retcode: 2,
        msg: '400 invalid request, please check your post data',
        res: null
      }))
    }
  })
}
