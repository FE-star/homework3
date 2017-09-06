$.mockjax({
    url: "/data/get",
    responseText: {
        retcode: 0,
        msg: "成功",
        res: {
            a: 1
        }
    }
});


describe('测试链式调用', function() {
    it('测试调用get', function(done) {
        var def = new Defer;
        def.done(function(res) {
            done();
        }).fail(function(res) {
            done();
        }).catch(function(e) {})
        setTimeout(function() {
            def.reject(1);
        }, 200)

    })
});

describe('测试链式调用', function() {
    it('测试调用post', function(done) {
        var def = new Defer;
        def.post({
            url: '/data/get',
            data: { a: 1 }
        }).done(function(res) {
            done();
        }).fail(function(res) {
            done();
        }).catch(function(e) {})
        setTimeout(function() {
            def.reject(1);
        }, 200)

    })
});

describe('两次', function() {
    it('两次调用done', function(done) {
        var def = new Defer;
        let n = 0;
        def.done(function(res) {
            n++;
            if (n === 2) done();
        })
        setTimeout(function() {
            def.resolve(1);
            def.resolve(2)
        }, 200);
    });

});

describe('捕获错误', function() {
    it('全部不抛出错误，打印错误', function(done) {
        var def = new Defer;
        def.done(function(res) {
            lasjdlfa;
            done();
        }).catch(function(e) {
            done();
        })
        setTimeout(function() {
            def.resolve(1)
        }, 200);
    })
});
describe('测试get获取数据', function() {
    it('测试各个回调是否完善', function(done) {
        let def = new Defer;
        let n = 0;
        def.get({
            url: '/data/get',
            data: { a: 1 }
        }).done(function(res, flag) {
            // console.log(res)
            // console.log(flag)
            done();
        }).fail(function(res) {
            console.log(res);
            done();
        }).catch(function(err) {
            console.error(err)
            done()
        });
    });
    it('有缓存调用两次', function(done) {
        let def = new Defer;
        let n = 0;

        def.get({
            url: '/data/get',
            data: { a: 1 }
        }).done(function(res, flag) {
            n++;
            if (n === 2) done();
        })

    });
});

describe('懒更新测试', function () {
    it('lazy为ture时立即返回', function (done) {
        /**
         * data 参数是请求入参
         * lazy 标记懒更新
         */
        let def = new Defer;
        let n = 1;
        def.get({
            url: "/data/get",
            data: { uin: 1234 },
            lazy: true
        })
            // 所以有缓存的时候，res应当立刻返回
            // 所以，res应当是上次的数据
            .done(function (res, flag) {
                n--;
                if (n === 0) done()
            })
    })
})

describe('缓存的最大生命是10s', function () {
    it('缓存的最大生命是10s', function (done) {
        let def = new Defer;
        let n = 1;
        def.get({
            url: "/data/get",
            data: { uin: 1234 },
            maxAge: 10000
        })
        .done(function (res, flag) {
            done()
        })
    })
})

describe('fail逻辑', function () {
    it('res.retcode值为1，调用1次', function (done) {
        storage.setItem('/data/fail','')
        $.mockjax({
            url: "/data/fail",
            responseText: {
                retcode: 1,
                msg: "成功",
                res: {
                    a: 1
                }
            }
        });
        let def = new Defer;
        let n = 1;
        def.get({
            url: "/data/fail",
            data: { uin: 1234 }
        })
        .fail(function (res) {
            console.log(res)
            done()
        })
    })
})