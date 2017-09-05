describe('调用请求',function(){
    it('测试调用get',function(done){
        var def = new Defer;
        def.done(function(e){
            done();
        })
        setTimeout(function(){
            def.resolve(1);
        },200)
    })
})