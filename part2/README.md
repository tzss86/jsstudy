# 杂记
------
学习js中遇见的 ***趣事***

#### 1.sum(2,3)实现sum(2)(3)

```javascript
let sum = (a) => (b) => a+b;
sum(2)(3);//2+3= 5

//那sum(2)(3)(5)?
let sum = (a) => (b) => (c) => a+b+c;
sum(2)(3)(5);//10

//那sum(2)(3)(5)......?
//思考
let sum = (a,b)=>a+b;
let newsum = sum.bind(null,2);
newsum(3);

[2,3,5].reduce((s,v,i,arr) => {return s+v});//10
```

#### 2.同事问：如何实现红绿灯？
方法很多种，我只把我最初想到的最简单的思路写下来。

```javascript
let timer;
let light = (start,g,y,r) => {
    let count = 0;
    if(start){
        timer = setInterval(()=>{
            if(count < g){
                console.log("绿灯：" + (g-count));
            } else if(count >= g && count < (g+y)){
                console.log("黄灯："+(g+y-count));
            } else if(count >= (g+y) && count < (g+y+r)){
                console.log("红灯："+(g+y+r-count));
            } else {
                count = 0;
                console.log("绿灯：" + g);
            }
            count++;
        },1000);
    } else {
        clearInterval(timer);
        timer = null;
        count = 0;
    }
};

light(true,10,3,10);//启动，设置10秒绿灯，3秒黄灯，10秒红灯，如此循环
light(false,0,0,0);//关闭，剩余参数可以设为0
//思考：如何优化？
```

<img src="./images/p2_1.png" width="15%" height="auto"/>

#### 3.如何渲染几万条数据不卡住页面？
看到这个问题的第一反应是：实际的产品设计中应该不会这种需求吧，首先几万条数据应该不是一次性请求回来的，肯定需要分批请求，或根据用户的操作加载更多数据。就算现在有几万条数据需要渲染出来，ios中会复用cell，其实超过一屏幕的cell就不会渲染了。那在网页中，肯定也是分批渲染的。

```html
<ul id="list"></ul>
```

```javascript
const total = 100000;//总数10万条
const once = 20;//单次插入20条
const loopCount = total / once; //需要渲染几次
let countOfRender = 0;

let list = document.querySelector("#list"); 

function addLi() {
  const fragment = document.createDocumentFragment(); //创建一个文档片段，通过将子元素li插入片段时，不会造成回流

  for (let i = 0; i < once; i++) {
   const li = document.createElement("li");
   li.textContent = Math.floor(Math.random() * total);
   fragment.appendChild(li);
  }

  list.appendChild(fragment);//将带20条li的片段插入到ul中
  countOfRender += 1;
  loop();

}
 
function loop() {
  if (countOfRender < loopCount) {//只要没达到总共需要渲染的次数，就不断重绘
    window.requestAnimationFrame(addLi);//刷新屏幕，add函数在下次重新绘制动画时执行。
  }
} 

loop();
```

<img src="./images/p2_2.png" width="45%" height="auto"/>


#### 4.页面上有一个input，还有一个p标签，改变input后p标签也跟着变化，如何处理？
乍一看，很简单呢，做个监听就好啦
```javascript
//html
<p id="num"></p>
<input type="text" name="num" id="numinput"/>

//js
var input = document.querySelector('#numinput');
var numtext = document.querySelector('#num');
input.addEventListener('input',function(event){
  numtext.innerText = event.target.value;
},false);//监听input值变化，有输入即触发

input.addEventListener('change',function(event){
  numtext.innerText = event.target.value;
},false);//监听input值变化，只有失去焦点时才触发

```

上面的方法就是最基本的实现input输入变化时p标签的值也跟着变化。再思考一下，input和p标签是不是捆绑得太紧了？我们来适当“松绑”一下：

```javascript
var data = {//数据对象
  num:0 
};

(function(){
  var self = this;
  function watch(obj,prop,callback){//监听函数
    let val = obj[prop];
    Object.defineProperty(obj,prop,{
      get: function(){
        return val;
      },
      set: function(newVal){
        val = newVal;
        callback(val);
      }
    });
  }
  self.watch = watch;
})();
```
我们重新创建了一个数据对象`data`,它有一个属性`num`，让它作为“中间人”来松绑input与p标签，不论是input的输入变化还是p标签的显示都只与中间人有关系，当input发生变化时，我们只去修改`num`的值，而p标签的值就是`num`的值，当`num`改变时，p标签也自动显示变化后的值了。那么需要一个`watch`功能的函数来监听`num`的变化，利用`Object.defineProperty`添加get和set，并在set时返回callback函数。

```javascript
watch(data,"num",function(v) {//监听num变化，在值变化时改变p标签的值，从此与input无关系
  numtext.innerText = v;
});
input.addEventListener('input',function(event){//input变化时只改变num的值，与p标签也无关系
  data.num = event.target.value;
},false);

input.addEventListener('change',function(event){
  data.num = event.target.value;
},false);

```



[返回顶端](#杂记) [返回目录](../README.md)