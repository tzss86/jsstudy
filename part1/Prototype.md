# 原型与原型链
------
js中“十大令人疑惑的概念排行榜”中“原型”与“原型链”绝对是值得讨论和学习的。

### Prototype（原型）

#### 一、原型（prototype）
>原型是存在于函数中的一个属性，它指向 **原型对象**

根据定义，我们就创建一个“构造函数”，把prototype属性打印出来看看到底是什么：
```javascript
function Person(name){
    this.name = name;
}
console.log(Person.prototype);
```
<img src="./images/p_15.png" width="28%" height="auto"/>

从打印结果看出，它指向的是一个 *“对象”*，这个对象有一个`constructor`，还有一个`__proto__`，`constructor`的值就是我们刚刚定义的Person函数，`__proto__`又是什么？值为什么是Object?
我们刚刚创建了一个Person构造函数，我们再为其定义一个公用方法`sayHi`，并new一个Person实例p。

```javascript
function Person(name){
    this.name = name;
}
Person.prototype.sayHi = function(){
    console.log(`Hi, ${this.name}`);
}
let p = new Person("rui");
console.log(p.sayHi());//Hi，rui
```
<img src="./images/p_17.png" width="15%" height="auto"/>

我们再看看此时实例对象p和Person原型对象的关系：

<img src="./images/p_18.png" width="45%" height="auto"/>

根据上图发现p的`__proto__`属性与Person.prototype是相同的，即它们都指向Person的原型对象。
而且，我们发现sayHi方法被添加到了这个 *原型对象*上。若我再创建一个p2实例，p2.sayHi()也是能正确执行的。由上面的讲诉，我们暂且可以得出下面的关系图：

