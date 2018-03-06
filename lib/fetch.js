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