const storage = window.localStorage;
class Defer {
    constructor() {
        this.successCbs = [];
        this.errorCbs = [];
        this.catchCbs = [];
        this.params = {};
    }
    fire(cbs, params, flag) {

        cbs.forEach((fn) => {
            try {
                fn.call(this, params, flag);
            } catch (err) {
                this.fire(this.catchCbs, err);
            }
        })
    }
    get(params) {
        this.params = params;
        // storage.setItem('res','')
        return this;
    }
    done(fn) {
        this.successCbs.push(fn);
        var storageData = storage.getItem(this.params.url);
        if(this.params.maxAge){
            var storageDataObj = JSON.parse(storageData);
        }
        if (storageData) {
            this.resolve(JSON.parse(storageData).res, true);
        }
        this.sendAjax();
        return this;
    }
    fail(fn) {
        this.errorCbs.push(fn);
        return this;
    }
    resolve(params, flag) {
        this.fire(this.successCbs, params, flag);
        return this;
    }
    reject(params, flag) {
        this.fire(this.errorCbs, params, flag);
        return this;
    }
    catch (fn) {
        this.catchCbs.push(fn);
        return this;
    }
    sendAjax() {
        var that = this;
        $.ajax({
            url: this.params.url,
            method: 'GET',
            data: this.params.data || {},
            success: function(res) {
                if (res.retcode == 0) {
                    var curTime = new Date().getTime();
                    storage.setItem(that.params.url, JSON.stringify({res:res,time:curTime}));
                    if(!that.params.lazy){
                        that.resolve(res, false);
                    }
                } else {
                    that.reject(res);
                }
            },
            error: function(err) {
                that.fire(that.catchCbs, err);
            }
        })
    }
}