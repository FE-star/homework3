// new Promise(function(resolve, reject) {
//   reject("fuck")
// }).then(function(res) {}, function(err) {
//   throw err;
// })
// .then(function(res) { console.log(res) })
// .catch(function (e) { console.log("fuckff", e) });


let option = {
  data: { uin: 12343 }, //请求的参数
  lazy: true,           //有缓存的时候，优先从缓存里面获取
  maxAge: 10000,        //设置缓存的最大声明是10秒
}

class Request {
  static get(url, options) {
    return fetch(`${ url }${ Request.obj2query(options.params) }`)
    .then(
      response => { return response.json(); },
      error => { throw error; }
    )
  }
  static post(url, options) {
    return fetch(`${ url }`, { method: "POST", body: options.params })
    .then(
      response => { return response.json(); },
      error => { throw error; }
    )
  }
  static obj2query(obj = {}) {
    return Object.keys(obj).reduce(function(result, keyName, index, arr) {
      let val = obj[keyName] instanceof Object ? JSON.stringify(obj[keyName]) : obj[keyName];
      result += index == 0 ? "?" : "&";
      return result += `${ keyName }=${ val }`
    }, "")
  }
}

module.exports = Request;