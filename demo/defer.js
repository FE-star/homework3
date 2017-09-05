
class Defer {
    constructor() {
        this.successCbs = [];
        this.errorCbs = [];
        this.catchCbs = [];
    }
    fire(cbs, params) {
        cbs.forEach((fn) => {
            console.log(fn)
            fn.call(this, params);
        })
    }
    get() {
        return this;
    }
    done(fn) {
        this.successCbs.push(fn);
        return this;
    }
    fail(fn) {
        this.errorCbs.push(fn);
        return this;
    }
    resolve(params) {
        this.fire(this.successCbs, params);
        return this;
    }
    reject(params) {
        this.fire(this.errorCbs, params);
        return this;
    }
}
