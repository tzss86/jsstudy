# 前端性能优化
------

前端性能优化是一个“庞大工程”，有很多方面需要考虑，但还需要根据实际项目考虑具体的瓶颈和问题，再针对问题进行相关的优化，才有意义。网上有很多讲优化的文章都总结得很好，下面的是一些基本的通用思想总结，主要来自两个方面。

>传输层面：减少请求数，降低请求量

>降低浏览器重新渲染的频率和成本：减少回流与重绘

#### 1. 减少Http请求

* 合并压缩js/css/图片等文件，减少http请求，以减轻对服务器的压力，方案：可以使用webpack构建工具来管理资源
* 采用缓存策略：HTTP协议缓存、浏览器本地缓存、CDN缓存、服务器缓存、数据库缓存等

##### 1.1 HTTP缓存

* 强制缓存200(from cache)与协商缓存304(not modified) 的区别

>强制缓存：在第一次请求服务器访问后，在过期时间之内不会重新请求。

通过判断HTTP Response Header:`expires(http1.0)/cache-control(http1.1)`判断是否过期。

* `expires`: Sat, 22 Dec 2018 11:05:24 GMT
* `cache-control`: max-age=600
* `cache-control`的值：

>private：客户端可以缓存

>public：客户端和代理服务器均可缓存；

>max-age=xxx：缓存的资源将在 xxx 秒后过期；

>no-cache：需要使用协商缓存来验证是否过期；

>no-store：不可缓存

* http1.1 优先级高于http1.0

>协商缓存:每次读取数据时需要跟服务器通信，第一次请求服务器访问后，服务器返回资源及 **缓存标识**，之后请求时浏览器先读取缓存标识发给服务器判断是否匹配，若不匹配就返回新数据和新缓存标识，若匹配就返回304，浏览器就读取本地缓存数据。

* 标识符：(http1.0)服务器返回`last-modified`: Wed, 19 Dec 2018 05:10:47 GMT（资源最后修改的时间），第二次请求时浏览器讲`last-modified`的值放到`If-Modified-Since`去与服务器的资源修改时间对比。
* 标识符：(http1.1)服务器返回`Etag`

##### 1.2 LocalStorge,SessionStorge

* LocalStorge:生命周期是永久，SessionStorge仅在当前会话下有效，关闭页面或浏览器后被清除。
* 同源页面下：LocalStorge可以共享，SessionStorage不行，但一个页面的不同iframe(iframe同源)可以共享SessionStorage。
* `sessionStorage.setItem(key, value);`|`sessionStorage.getItem(key);`
* `localStorage.setItem(key, value);` | `localStorage.getItem(key);`

#### 1.3 Service Worker

* 可以实现离线应用消息推送等等一系列的功能，缩小与原生应用的差距。
* Service Worker 只能在https协议下使用。
* Service Worker整个的使用过程包括了注册，安装，激活，睡眠销毁等等一系列的状态。

##### 1.4 缓存如何更新？

好文章：[https://github.com/fouber/blog/issues/6]

#### 2. 降低浏览器重新渲染频率和成本

##### 2.1 [回流与重绘](./Note1.md)

#### 3.好文章

[https://github.com/fouber/blog/issues/3]

[https://github.com/Nbsaw/notes/issues/38]

[https://github.com/fouber/blog/issues/10]

[https://github.com/sunmaobin/sunmaobin.github.io/issues/56]
