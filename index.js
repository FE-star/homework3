let Koa = require('koa')
let app = new Koa()
let static = require('koa-static')
let path = require('path')
let _STATIC_PATH = path.join(__dirname, './public')
app.use(static(_STATIC_PATH))
app.use(async (ctx)=>{
    ctx.cookies.set(
      'uid', 
      'Mr.Right',
      {
      	domain: 'localhost',
        maxAge: 20 * 1000, // cookie有效时长
        httpOnly: false,  // 是否只用于http请求中获取
        overwrite: false  // 是否允许重写
      }
    )
    ctx.body = 'cookie is ok'

})
app.listen(9876, ()=>{console.log('running')})