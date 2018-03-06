const Tapable = require('tapable')
const Deferred = require('./deferred')
const Request = require("./fetch")
const Storage = require("./storage")

class DB extends Tapable {
  constructor(url = "") {
    super()
    this.url = url;
  }
  request(method = "GET", options = {}) {
    let _self = this;
    let defer = new Deferred();
    let cache = JSON.parse(Storage.get(this.url));
    let params = options.data || {};
    let lazy = Boolean(options.lazy);
    let maxAge = options.maxAge;
    let isExpire = true;

    if (cache) {
      isExpire = maxAge && ((new Date().getTime() - cache.lastModified) > maxAge)
      defer.resolve(cache.data, 1);
    }
    if (cache && !isExpire) return defer;
    
    Request[method.toLowerCase()](this.url, { params })
    .then(data => {
      if (data.retcode == 0) {
        Storage.set(this.url, JSON.stringify({ data, maxAge, lastModified: new Date().getTime() }));
        if (!lazy) defer.resolve(data, 0)
      } else {
        defer.reject(data);
      }    
    })
    .catch(err => { defer.runCatch(err); });

    return defer;
  }
  get(options = {}) {
    return this.request("GET", options);
  };
  post(options = {}) {
    return this.request("POST", options);
  }
}

module.exports = DB