# 事件
------

js中的事件有很多分类，例如最常见的点击事件，鼠标移动，键盘keyup，表单提交等等。

* 事件包含三个阶段：`捕获阶段` `目标阶段` `冒泡阶段`。
* 通常事件处理函数在`冒泡阶段`处理。
* 常见的处理方式是将事件监听器直接绑定到对应的DOM元素上，然而当元素很多时，例如：`ul`有100个`li`，循环100次绑定`click`事件到`li`上，会造成内存占用越来越大，而且操作100次DOM对页面性能也很不友好，我们要尽量减少对DOM的操作。所以利用`事件委托/代理`可以将点击监听器绑定到父级元素`ul`上，利用`事件冒泡`阶段进行查找，可以大大减少与dom的交互次数，提高性能。

* 事件委托：将事件监听器绑定到父级元素，通过事件冒泡来处理。

```html
<!DOCTYPE html>
<html>
<head>
    <title></title>
</head>
<body>
    <ul id="list">
      <li><span>item 1</span></li>
      <li><span>item 2</span></li>
    </ul>
    <script>
        function eventDelegate (parentSelector, targetSelector, events, fn) {
          // 触发执行的函数
          function triFunction (e) {
            // 兼容性处理
            var event = e || window.event;

            // 获取到目标阶段指向的元素
            var target = event.target || event.srcElement;

            // 获取到代理事件的函数
            var currentTarget = event.currentTarget;

            // 处理 matches 的兼容性
            if (!Element.prototype.matches) {
              Element.prototype.matches =
                Element.prototype.matchesSelector ||
                Element.prototype.mozMatchesSelector ||
                Element.prototype.msMatchesSelector ||
                Element.prototype.oMatchesSelector ||
                Element.prototype.webkitMatchesSelector ||
                function(s) {
                  var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                    i = matches.length;
                  while (--i >= 0 && matches.item(i) !== this) {}
                  return i > -1;            
                };
            }

            // 遍历外层并且匹配
            while (target !== currentTarget) {
              // 判断是否匹配到我们所需要的元素上
              if (target.matches(targetSelector)) {
                var sTarget = target;
                // 执行绑定的函数，注意 this
                fn.call(sTarget, Array.prototype.slice.call(arguments))
              }

              target = target.parentNode;
            }
          }
          // 如果有多个事件的话需要全部一一绑定事件
          events.split('.').forEach(function (evt) {
            // 多个父层元素的话也需要一一绑定
            Array.prototype.slice.call(document.querySelectorAll(parentSelector)).forEach(function ($p) {
              $p.addEventListener(evt, triFunction);
            });
          });
        }

        eventDelegate('#list', 'li', 'click', function () { console.log(this); });
    </script>
</body>
</html>
```

来源：[地址](https://zhuanlan.zhihu.com/p/26536815)

[返回顶端](#事件) [返回目录](../README.md)
