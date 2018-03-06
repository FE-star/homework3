const Koa = require('koa');
const route = require('koa-route');
const cors = require('koa-cors');
const app = new Koa();

// app.use(cors);


app.use(route.get("/", function() {
  this.set("Access-Control-Allow-Origin", "*");
  this.body = {
    retcode: 200,
    data: { name: "ppap", content: "i have a pen, i have an apple..." },
    msg: "hello word!" 
  };
}))
app.use(route.get("/test_fail", function() {
  this.set("Access-Control-Allow-Origin", "*");
  this.body = {
    retcode: 10000,
    msg: "未登录之类的..."
  }
}))

app.listen(3011, () => { console.log("server init") });