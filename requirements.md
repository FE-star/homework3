homework3 需求文档

### 所有请求

POST

GET

request:
```
a. protocol://endpoint
b. protocol://endpoint/id 之类的 parameter
c. protocol://endpoint?query 之类的查询能力
```

response:

* 200

```
{
  retCode: 200,
  msg: 'OK',
  res: data (Array.isArray(data) === true data.length >= 0)
}
```

* 400 endpoint 正确，1. 可能发生在带 query GET 数据的时候

```
{
  retCode: 400,
  msg: 'Bad Request. ',
  res: 'Error: invalid params. Please check request params'
}
```

* 401 未登录/无 token 等未认证情形

```
{
  retCode: 401,
  msg: 'Unauthorized. Please login',
  res: 'Unauthorized'
}
```

* 403 登陆状态丢失。原来是登录的，但可能是 cookie 过期了，或者 token 过期了。

```
{
  retCode: 403,
  msg: 'Forbidden.',
  res: ''
}
```

* 404 endpoint 错误

```
{
  retCode: 404,
  msg: 'Not Found',
  res: 'Error: invalid endpoint. Please check endpoint'
}
```

* 500 server error

```
{
  retCode: 500,
  msg: 'Server Internal Error.',
  res: ''
}
```

PUT

PATCH

DELETE


### 同域、跨域

### 缓存

   缓存的实际情况

* localStorage 溢出的情况
* localStorage 的加载形式
  * 默认，情况下，如果没缓存，成功请求回调一次，如果有请求成功缓存应当回调两次，这样可以保证页面快速渲染，而不需要等数据返回
  * lazy更新，有缓存的情况下直接读取缓存，只有一次回调，但会发出请求，请求返回后只更新缓存里的数据为最新的，这样，下次再调用
    就能拿到这次更新的数据了  options.lazy = true
  * 在maxAge内使用缓存，则当发现缓存里的数据小于maxAge，则直接读取缓存，不发出任何请求，否则发出请求读取请求的数据
    options.maxAge = 1000 // 即缓存是1s，也就是说这个单位是ms



### request 方法要求返回一个 promise

request 返回的 promise 可以做 done/fail/error-catch
