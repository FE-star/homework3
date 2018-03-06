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
  it('可以正常请求接口', function (finish) {
    R.get({ maxAge: 10000 }).done((res, flag) => { 
      console.log(res, flag);
      finish();
    })
  })
  it('失败了应该告诉失败原因', function (finish) {
    F.get().done(res => {
    }).fail(res => {
      console.log(res);
      finish();
    })
  })
  it('出错了应当能捕捉错误', function (finish) {
    C.get().done(res => { }).fail(res => { }).catch(e => {
      console.log("成功捕捉错误", e);
      finish();
    })
  })
  it('lazy参数为true时，有缓存应该从缓存里拿数据', function (finish) {
    R.get({ data: { desc: "mother fucker" }, lazy: true }).done((res, flag) => {
      if (flag == 0) {
        console.log("缓存没有东西，直接请求获取数据", flag == 0)
        return finish();
      }
      console.log("lazy参数为true时，有缓存应该从缓存里拿数据", flag == 1);
      finish(assert.equal(flag, 1));
    })
  })
})