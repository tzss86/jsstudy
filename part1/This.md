# This
------
js中的this关键字其实令人困惑，但日常开发学习中，记住下面的内容，就可以啦。
在其他语言中，*this* 是对类实例化的当前对象的引用，在js中，*this* 通常指“拥有”该方法的对象，但它还取决于函数的调用方式。

#### 一、几种常见情况

<img src="./images/p_8.png" width="50%" height="auto" style="margin-left: 5%"/>

* 如果是调用一个对象的构造函数或者方法，则this是指向对象实例，这种情况和大多数其他语言一样了
* 如果没有当前对象，this 指全局对象（在web浏览器中，this为Window）
* 如果是单纯的调用一个函数，此时函数内部的this 仍然是全局对象
* 如果是单纯的调用一个函数，严格模式下this 是undefined
* 在事件中，this指向接收事件的元素
* 注意，当使用`call()` `apply()` `bind()`函数时，可将this 指到任意的对象上去
* 注意，箭头函数是没有this 的，在箭头函数内部的this会指向其最近一层非箭头函数的owner，且箭头函数使用`call()` `apply()` `bind()`方法不会改变this的指向，会被直接忽略。

#### 二、例子说明

##### 调用对象的方法
```javascript
var x = 1;
var obj = {
    x:2,
    f:function(){
        console.log(this.x);
    }
}
obj.f();//2
```
因为f函数在obj内部，此时this是指向obj的，所以this.x === obj.x

##### 没有对象
```javascript
var x = 1;
var f = function(){
    console.log(this.x);
}
f();//1

var f = function(){
    return function(){
        console.log(this.x);
    }
}
f()();//1
```
此时this是全局对象window，在window中找到变量x，所以值是1。若在全局中没有找到x，则会返回undefined，思考下图：
<img src="./images/p_10.png" width="28%" height="auto"/>

##### 严格模式下
```javascript
var f = function(){
    "use strict"
    console.log(this.x);
}
f();//js报错
```
<img src="./images/p_9.png" width="50%" height="auto"/>

##### 事件上的this
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
</head>
<body>
    <button id="btn">btn</button>
    <script> 
        var btn = document.getElementById('btn');
        btn.onclick = function(){ 
                console.log("this=");
                console.log(this)
            }
    </script>
</body>
</html>
```
接收点击事件的元素是button，故this是指button

<img src="./images/p_11.png" width="30%" height="auto"/>

##### call() apply() bind() 改变this指向

```javascript
function showMessage(message) {
    console.log(`${this.name} ${message}`);
}
const obj = {name: "rui"};

showMessage("welcome");//  welcome 

showMessage.call(obj, "welcome");//rui welcome
showMessage.apply(obj,["welcome"]);//rui welcome
showMessage.bind(obj,"welcome")();//rui welcome

```

