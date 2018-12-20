this.addEventListener('message', function (e) {
  this.postMessage('向主线程发消息: 你刚刚发来的内容是：' + e.data.name + e.data.args);
  timedCount();
}, false);

var i=0;

function timedCount(){
	i=i+1;
	postMessage(i);
	setTimeout("timedCount()",500);
}

