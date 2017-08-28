const express = require('express')

const app = express()

module.exports = {
  server: app.listen(3000),
  app: app
}
