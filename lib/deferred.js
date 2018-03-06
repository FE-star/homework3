class Deferred {
  constructor() {
    this.resolveHandlers = [];
    this.rejectHandlers = [];
    this.catchHandlers = [];
  }
  resolve(...args) {
    setTimeout(() => {
      this.resolveHandlers.forEach(fn => { fn.apply(this, args) });
    }, 0)
  }
  dequeueResolve(...args) {
    setTimeout(() => {
      while (this.resolveHandlers.length > 0) {
        let fn = this.resolveHandlers.shift();
        fn.apply(this, args);
      }
    }, 0)
  }
  reject(err) {
    setTimeout(() => {
      this.rejectHandlers.forEach(fn => { fn.call(this, err) });
    }, 0)
  }
  runCatch(e) {
    setTimeout(() => {
      this.catchHandlers.forEach(fn => { fn.call(this, e) });
    }, 0)
  }
  done(fn) {
    this.resolveHandlers.push(fn);
    return this;
  }
  fail(fn) {
    this.rejectHandlers.push(fn);
    return this;
  }
  catch(fn) {
    this.catchHandlers.push(fn);
    return this;
  }
}


// let defer = new Deferred();
// setTimeout(function() {
//   defer.resolve({ fuck: "ok" });
// }, 0)
// setTimeout(function() {
//   defer.resolve({ fuck: "off" });
// }, 1000)
// defer.done(function(res) {
//   console.log(res);
// }).done(function(res) {
//   console.log("fff", res);
// })
// console.log("fuck");

module.exports = Deferred;