var http = require('http')
var options = {
  host: 'localhost',
  port: 3000,
  path: '/'
}

var request = http.request(options, function (resp) {
  // console.log(res.res)
  console.log(resp.res)

  resp.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`)
  })

  resp.on('end', () => {
    console.log('No more data in response.')
  })
})

request.on('error', (res) => {
  console.log('on err')
  console.log(res)
})

request.end()
