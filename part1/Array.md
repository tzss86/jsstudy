# 数组
------
js中最常使用的就是数组了，这里简单记录一下常用的方法，温故知新。

### 一、来自ES3的数组方法

##### 1.`join([separator])`

* 将数组元素转化为字符串连接在一起。
* `Array.prototype.join() <--->  String.prototype.split()`
* 参数分隔符默认值为逗号。

```javascript
var a = [1,2,3];
a.join();//"1,2,3"
a.join("");//"123"
a.join("-")//"1-2-3"
var str = "123";
str.split("");//["1", "2", "3"]
```
##### 2.`reverse()`

* 将数组元素颠倒顺序
* 不会新创建数组，而是在原先数组中重新排列
* 无需参数

```javascript
var a = [1,2,3];
a.reverse();
console.log(a);//[3, 2, 1]
```

##### 3.`sort()`

* 将数组中的元素排序并返回排序后的数组
* 若不带参数，则按照字母表顺序排序
* 元素中若有undefined元素，会排在数组尾巴
* 可传一个比较函数当作参数：
`function compare(a1,a2){return a1 - a2;}//升序 | return a2 - a1 降序`
    * a1排在a2前面，则返回负数；
    * a1排在a2后面，则返回正数；
    * a1 等于 a2，则返回0

```javascript
var a = [1,2,3,"aa","c",90,25,undefined,222,111,null,89];
a.sort();
console.log(a);//[1, 111, 2, 222, 25, 3, 89, 90, "aa", "c", null, undefined]
a.sort((a1,a2) => a1 - a2);
console.log(a);//[null, 1, 2, 3, 25, 89, 90, 111, 222, "aa", "c", undefined]
```
##### 4.`concat()`

* 将调用concat()的数组与传入的参数合并
* 会返回一个新的数组
* 不会递归扁平化数组的数组。

```javascript
var a = [1,2,3];
a.concat(4,5,6);//[1, 2, 3, 4, 5, 6]  a不变，仍是：[1,2,3]
a.concat([9,8],[12,25]);// [1, 2, 3, 9, 8, 12, 25]
a.concat([11,[10,9]],77);//[1, 2, 3, 11, [10,9], 77] 不会递归[10,9]
```
##### 5.`slice()`

* 返回数组的片段/子数组
* 有两个参数：[起始位置索引,结束位置索引)
* 若只传start位置，end默认到数组的结尾
* 若参数是负数，则表示相对于最后一个元素的位置
* 会创建新的素组并返回，原数组不会改变

```javascript
var a = [1,2,3,4,5];
a.slice(3);//[4, 5]
a.slice(2,4);//[3, 4]
a.slice(1,-1);//[2, 3, 4] -1代表数组最后一个元素
a.slice(-3,-1);//[3, 4]
```

##### 6.`splice()`

* 插入或删除数组元素
* 有三个或更多的参数：[要插入/删除元素开始的位置，要删除的元素个数，要插入的元素1，要插入的元素2，...]
* 若只有一个参数，则从起始点开始，删除剩余所有元素。

```javascript
var a = [1,2,3,4,5];
a.splice(3);//从索引3即是元素4开始删除剩余所有元素，返回 [4, 5]， a 变为[1, 2, 3]
a.splice(0,2);//a为[1,2,3],从元素1开始删除2个元素，即返回[1, 2]，a 变为[3]
a.splice(0,2,"a","b");//a为[3]，从0开始删除2个元素，再插入"a"和"b",a变为["a", "b"]
a.splice(2,0,6);//a 变为["a", "b", 6]
```

##### 7.`push()/pop()`

* 把数组当成栈，在数组尾巴上添加/删除元素

```javascript
var a = [1,2,3,4,5];
a.push(6);//a:[1, 2, 3, 4, 5, 6]
a.push(7);//a:[1, 2, 3, 4, 5, 6, 7]
a.pop();//a:[1, 2, 3, 4, 5, 6]
a.pop();//a:[1, 2, 3, 4, 5]
```

##### 8.`unshift()/shift()`

* 在数组头部添加/删除元素

```javascript
var a = [1,2,3,4,5];
a.unshift(6);//a:[6, 1, 2, 3, 4, 5]
a.unshift(7);//a:[7, 6, 1, 2, 3, 4, 5]
a.unshift([9,0],88);//a:[[9,0], 88, 7, 6, 1, 2, 3, 4, 5]  [9,0]和88 会一次性插入数组开头，不会先出入[9,0]，再插入88
a.shift();//a:[88, 7, 6, 1, 2, 3, 4, 5]
a.shift();//a:[7, 6, 1, 2, 3, 4, 5]
```
### 二、来自ES5的数组方法

##### 1.`forEach()`

* 从头到尾遍历数组元素，为每个元素调用指定的函数
* 指定的函数有3个参数：（value,index,arr）value是当前元素的值，index是在数组中的索引，arr是整个数组
* forEach()没有break语句

```javascript
var a = [1,2,3,4,5];
a.forEach((v,i,arr)=>a[i]=v+1);//a: [2, 3, 4, 5, 6]
```

##### 2.`map()`

* 将调用map()的数组的每个元素传递给指定函数，并返回一个数组，它是函数的返回值
* 与forEach()相同，但调用的指定函数需要返回值
* 若是稀疏数组调用，返回的新数组也同样是稀疏的，同样的长度，同样的缺失元素

```javascript
var a = [1,2,3,4,5];
a.map((v,i,arr)=>v*v);//a: [1, 4, 9, 16, 25]
```

##### 3.`filter()`

* 返回调用它的数组的一个子集，传入的函数返回值若为true，则添加到返回数组中，若为false，则不会添加到返回数组中
* filter()会跳过稀疏元素，返回的数组总是稠密的
* 可以用filter()来压缩空缺，undefined,null元素
    * `a = a.filter((x)=>return x !== undefined && x !== null;)`

```javascript
var a = [1,2,3,4,5];
var res = a.filter((v,i,arr) => v>3);//a 不变
console.log(res);//[4, 5] 返回大于3的元素组成的数组
```

##### 4.`every()/some()`

* 对数组元素作指定函数的判断，返回true/false.
* every() 所有元素返回true,才返回true
* some() 一个元素返回true,就返回true
* every() 遇上一个false,则停止循环，返回false
* some() 遇上一个true,则停止循环，返回true

```javascript
var a = [1,2,3,4,5];
var res1 = a.every((v,i) => {return v < 10;});//所有元素都小于10，返回true
var res2 = a.some((v,i) => {return v > 4;});//一个5大于4，返回true
```

##### 5.`reduce()/reduceRight()`

* 使用指定函数将元素进行组合，生成单个值
* reduce(f,initValue) f为指定函数，initValue传入f的初始值
* f指定函数有4个参数：(叠加值=initValue, v, i, arr) 首次调用时，叠加值等于初始值
* 当initValue不传时，叠加值第一次为数组的第一个元素
* reduceRight 是从右到左遍历，而非从左到右

```javascript
var a = [1,2,3,4,5];
var res = a.reduce((s,v,i,arr) => {return s+v;}, 0);
console.log(res);//15 
//执行过程是：s=0+1
//          s=1+2
//          s=3+3
//          s=6+4
//          s=10+5
```

##### 6.`indexOf()/lastIndexOf()`

* 搜索整个数组中具有给定值的元素，返回找到的第一个元素的索引
* 没找到就返回-1
* indexOf() 是从头到尾  lastIndexOf() 是从尾到头
* 有2个参数：(待找的元素，开始查找的索引)
* 字符串也有这两个方法

```javascript
var a = [1,2,3,4,5];
a.indexOf(4);//3
a.indexOf(40);//-1
a.lastIndexOf(2);//1
```

### 三、来自ES6的数组方法

##### 1.`find()/findIndex()`

* find()返回数组中满足测试函数的第一个元素，找不到返回undefined
* findIndex()返回数组中满足测试函数的第一个元素的索引值，找不到返回-1
* 两个参数：find(fn,this) fn为测试函数，this为测试函数的this值

```javascript
var a = [1,2,3,4,5];
a.find((v) => v>4);//返回元素5
a.findIndex((v) => v>4);//返回5的索引4
//找数组中的对象
var objs = [{name:"rui"},{name:"xin"}];
objs.find((v)=>{return v.name === "xin"});//{name: "xin"}
```

##### 2.`fill()`

* 填充数组元素的方法
* 只传一个参数，整个数组的每个元素将被填充成这个参数
* 若传3个参数：fill(填充的值，起始位置，结束位置)
* [起始位置，结束位置)

```javascript
var a = [2,8,7];
a.fill(3);//[3,3,3]
```

##### 3.`copyWithin()`

* 与fill相似，也是改变数组的元素值
* 3个参数：copyWithin(开始填充的位置，开始复制的元素位置，停止复制的元素位置)
* [开始复制的元素位置，停止复制的元素位置)

```javascript
var a = [1,2,3,4,5];
a.copyWithin(0,3,4);//a:[4, 2, 3, 4, 5]
```

##### 4.`Array.of()`

* 创建数组的方法
* 解决了`new Array()`的“怪异”行为
* “怪异”行为是指：当只传1个数值参数时，会被赋值到length属性，而不是当成元素
* 不过一般用字面量方式创建数组即可

```javascript
var a = Array.of(4);
a[0];//4
a.length;//1

var a = new Array(4);
a[0];//undefined
a.length;//4
```

##### 5.`Array.from()`

* 把 *类数组*（拥有一个length属性和若干索引属性的对象）转换为 *数组*
* 把可迭代对象（例如：Map,Set） 转换为 *数组*
* Array.from(待转换的对象，fn, this) fn是映射函数，this是映射函数的this值
* 返回一个新数组

```javascript
var s = new Set([3,5,7]);//s: Set(3) {3, 5, 7}
var s1 = Array.from(s);//[3, 5, 7]
var s2 = [...s];//[3, 5, 7]

var m = new Map([["name","rui"],["age",18]])//m:Map(2) {"name" => "rui", "age" => 18}
var m1 = Array.from(m);//"[["name","rui"],["age",30]]"

function f(){
    return Array.from(arguments);
}

f(1,3,5);// [1, 3, 5]
```

[返回顶端](#数组) [返回目录](../README.md)