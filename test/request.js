const request = require('../lib')
const assert = require('assert')
// just for the real answer, please ignore
// if (!DB.prototype.request) {
//   DB = require('../lib/.db')
// }

describe('FE-Request', function () {
  const R = request("http://127.0.0.1:3011");
  const F = request("http://127.0.0.1:3011/test_fail");
  const C = request("xxx");
  it('可以正常请求接口', function (done) {
    R.get({ maxAge: 10000 }).done((res, flag) => { 
      console.log(res, flag);
      done();
    })
  })
  it('失败了应该告诉失败原因', function (done) {
    F.get().done(res => {
    }).fail(res => {
      console.log(res);
      done();
    })
  })
  it('出错了应当能捕捉错误', function (done) {
    C.get().done(res => { }).fail(res => { }).catch(e => {
      console.log("成功捕捉错误", e);
      done();
    })
  })
  it('lazy参数为true时，有缓存应该从缓存里拿数据', function (done) {
    R.get({ data: { desc: "mother fucker" }, lazy: true }).done((res, flag) => {
      if (flag == 0) {
        console.log("缓存没有东西，直接请求获取数据", flag == 0)
        return done();
      }
      console.log("lazy参数为true时，有缓存应该从缓存里拿数据", flag == 1);
      done(assert.equal(flag, 1));
    })
  })
})