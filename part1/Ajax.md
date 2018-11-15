# Ajax
------
Ajax 是Asynchronous Javascript + XML的缩写，这种技术使得client端向server端请求数据时，不需要重新加载页面。

#### 1.多种实现方式

| 方式 | 描述  | 备注 |
| ----|----| ----|
|`<img src="url">` | 当为img元素的src属性设置URL时，浏览器会发起HTTP GET请求，可以单项将数据发送至服务器|无法从服务器响应提取信息，因为通常是返回一张图片|
|`<iframe src="url">`| 当iframe的URL向服务器发起请求后，服务器返回一个包含响应信息的HTML文档，并在`<iframe>`中显示|客户端可以通过css样式隐藏它，通过遍历iframe文档对象读取响应信息，但受同源策略限制|
|`<script src="url">`也称做'JSONP'|通过动态设置script的src属性，浏览器会发送一个HTTP请求下载数据|不受同源策略影响，可以跨域请求，且包含JSON编码数据的响应会自动执行|
|`XMLHttpRequest`|通过`XMLHttpRequest`对象发起的HTTP请求，可以方便的向服务器发送GET、POST等请求，且服务器的响应可以任意形式返回|受同源策略影响|
|`jQuery.ajax()`|jQuery库封装的请求数据的方法|方法中封装了`XMLHttpRequest` API以及跨域的`script` `jsonp`|


#### 2.同源策略与跨域需求

>如果两个页面的协议，端口（如果有指定）和域名都相同，则两个页面具有相同的源

* 以`http://mp.company.com/dir/page.html`来检测下面地址是否是同源的：
* `http://mp.company.com/dir2/other.html` ——协议http相同，域名store.company.com相同，端口默认80端口相同，故 *同源*
* `https://oss.company.com/dir/other.html` ——协议https不同，域名news.company.com也不同，是 *跨源*

>浏览器安全机遇同源策略，同源策略规定了下面几种情况在 *跨源* 时不能访问

* Cookie、LocalStorage 和 IndexDB 不能访问
* DOM 不能访问
* AJAX 请求不能发送

实际生产活动中，时常会需要“跨源”获取一些数据，例如：a.company.com 与 b.company.com 之间要访问cookie，iframe之间要相互操作DOM，亦或者WebAPP要访问服务器端API数据，都是需要跨源的。这样的情况下，可以在服务器端设置CORS，让服务器允许白名单跨源资源共享。
若服务器端不是自己的，规避同源策略还是有多种方法的，详细参见[阮老师的博客](http://www.ruanyifeng.com/blog/2016/04/same-origin-policy.html)


#### 3.XMLHttpRequest对象的使用
```javascript
let request = (method,url,async,pdata,callback) => {
    
    var xhr = new XMLHttpRequest();//创建一个xmlhttprequest对象实例，每一个实例都是一个请求/响应对。
    
    xhr.onreadystatechange = () => {//请求分为同步和异步，通常情况下为了不影响用户体验都选择异步请求，监听readystatechange状态的改变可以对相应的状态进行及时处理
        if(xhr.readyState == 4){//readyState表示HTTP请求的状态，4表示已经完成响应，数据接收完毕了。
            if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304){//status是状态码，200表示成功，304表示可以读取浏览器缓存
                var type = xhr.getResponseHeader('Content-Type');//获取响应头的Content-Type，判断一下返回的数据类型
                if(type.indexOf('xml') > -1 && xhr.responseXML){//若是xml类型，可读取专有字段responseXML，获取返回的xml
                    callback(xhr.responseXML);
                } else if(type.indexOf('application/json') > -1 ){//若是返回的json格式，则可JSON.parse()解析
                    callback(JSON.parse(xhr.responseText));
                } else {//其他格式就直接返回结果
                    callback(xhr.responseText);
                }
            } else {
                console.log(xhr.status);
                callback(xhr.status);//请求不成功，返回状态码
            }
        } else {
            console.log(xhr.readyState);//HTTP请求的其他状态，可能是0：还未open()，1：open()，2：接收到头信息，3：开始接收部分数据
        }
    }
    
    xhr.open(method,url,async);//创建了xhr请求后，需要通过open函数打开一个请求，3个参数，分别是请求的方法“GET”|“POST”，请求的地址url，以及是否异步请求（通常都是true）
    if(method == 'get'){
        xhr.send(null);//若是get请求，直接send，没有额外数据发送，null必须填
    } else if(method == 'post'){
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");//若是post请求，需要定义一下请求头的Content-Type字段，告诉服务器发送的格式是什么。这里是发送的json数据，所以是application/json
        xhr.send(JSON.stringify(pdata));//send()接受参数类型是字符串或者FromData或者file，所以需要JSON.stringify一下。
    }
}
let url = 'http://xxxx/xx/xx/xx';
request('GET',url,true,null,(data) => {
 console.log(data);
});

let postData = {"name":"rui","age":18,"avatar":"xxx.jpg"};
request('POST',url,true,postData,(data) => {
 console.log(data);
});

```

#### 4.JSONP的使用

> 同源情况下，你可以采取XMLHttpRequest和JSON.parse()获取数据，就像上面的例子一样；
> 若服务器端开启了CORS，在支持CORS的浏览器下，跨域的文档数据也可以通过XMLHttpRequest访问；
> 在不支持CORS的浏览器下，跨域的文档数据只能通过`<script>`元素访问了。

* 当通过`<script>`元素来调用数据时，服务器端必须返回一个jsonp响应，格式:
```javascript
handleResponse({"status":true,"result":[{"name":"xxx"},{"name":"bbb"}]});
```
*  jsonp响应需要用js函数名和圆括号把json数据包裹起来。
* 既然服务器在响应jsonp请求时需要特殊处理返回的数据，那客户端也需要告诉服务器这个请求时jsonp请求，请区别对待，通常是在url后面追加一个`?jsonp`or `&jsonp`。
* 另外，服务器不会强制定义客户端要实现的回掉函数名字，例如`handleResponse`，一般也是由客户端在url上添一个`&callback=handleResponse`参数，服务器端查询到`callback`后，使用这个函数名去填充数据。也可以是其他参数例如：`jsonp=handleResponse`

```javascript
let getJSONP = (url,callback) => {
    var cbnum = "cb" + getJSONP.counter++;
    var cbname = "getJSONP."+cbnum;
    console.log(cbname);

    if(url.indexOf("?") === -1){
        url += "?jsonp="+cbname;
    } else {
        url += "&jsonp="+cbname;
    }
    var script = document.createElement('script');
    getJSONP[cbname] = function(response){
        try{
            callback(response);
        } 
        finally {
            delete getJSONP[cbname];
            script.parentNode.removeChild(script);
        }
    };
    script.src = url;//触发请求
    document.body.appendChild(script);//添加到<body>中
};
getJSONP.counter = 0;//唯一回调函数名称计数器
```
回调函数名可以随机命名，上面的例子是《权威指南》里的例子，设计了一个`getJSONP.0`，`getJSONP.1`，`getJSONP.2`...这样不会重复的回调函数名称。jQuery中的jsonp请求也是类似的生成一个随机名称

```javascript
$.ajax({
        url: "http://xxx/xxx",
        type: "POST",
        dataType: "jsonp",//只需设置数据类型是jsonp
        jsonp: "callback",
        success: function (data) {
            var result = JSON.stringify(data);
         }
    });
```

jQuery会自动使用`<script>`元素并随机生成一个callback名称用于内部接收服务器响应，最后再通过success回调函数把响应数据反馈出来

#### 5.参考规范
[xhr.spec](https://xhr.spec.whatwg.org/)

[返回顶端](#Ajax)
