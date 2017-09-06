const storage = window.localStorage;
class Defer {
    constructor() {
        this.successCbs = [];
        this.errorCbs = [];
        this.catchCbs = [];
        this.params = {};
        this.method = 'GET';
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
        this.method = 'GET';
        this.params = params;
        return this;
    }
    post(params){
        this.method = 'POST';
        this.params = params;
        return this;
    }
    distribution(){
        try{
            var storageData = storage.getItem(this.params.url);
        }catch(e){

        }
        if (this.params.maxAge) {
            if (storageData) {
                var storageDataObj = JSON.parse(storageData);
                if (new Date().getTime - this.params.maxAge < storageDataObj.time) {
                    this.resolve(JSON.parse(storageData).res, true);
                }else{
                    this.sendAjax();
                }
            }
            return this;
        }
        if (storageData) {
            this.resolve(JSON.parse(storageData).res, true);
        }
        this.sendAjax(storageData);
    }
    done(fn) {
        this.successCbs.push(fn);
        this.distribution();
        return this;
    }
    fail(fn) {
        this.errorCbs.push(fn);
        this.distribution();
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
    catch(fn) {
        this.catchCbs.push(fn);
        return this;
    }
    sendAjax(storageData) {
        var that = this;
        $.ajax({
            url: this.params.url,
            type: this.method,
            data: this.params.data || {},
            success: function (res) {
                if (res.retcode == 0) {
                    var curTime = new Date().getTime();
                    if (!that.params.lazy || !storageData) {
                        that.resolve(res, false);
                    }
                    try{//避免无痕浏览报错
                        storage.setItem(that.params.url, JSON.stringify({ res: res, time: curTime }));
                    }catch(e){
                        
                    }
                } else {
                    that.reject(res);
                }
            },
            error: function (err) {
                that.fire(that.catchCbs, err);
            }
        })
    }
}