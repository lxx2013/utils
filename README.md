# utils
# 供CDN方式调用的工具代码

## 0. 字符串 hash.js
```js
String.prototype.hashCode = function (caseSensitive) {
  var str = caseSensitive ? this : this.toLowerCase();
  // 1315423911=b'1001110011001111100011010100111'
  var hash = 1315423911, i, ch;
  for (i = str.length - 1; i >= 0; i--) {
    ch = str.charCodeAt(i);
    hash ^= ((hash << 5) + ch + (hash >> 2));
  }
  return (hash & 0x7FFFFFFF);
};
```
经过下列测试输出576, 比[ stackoverflow 前2个答案](https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript)的300+的结果要好,应该是使用了大素数的原因
```js
var b = {}
for (var i = 0; i < 900; i++) {
  b[i.toString().hashCode() % 900] = i;
}
console.log(Object.keys(b).length);
```
## 1. client.js 客户端检测

*对应 Javascript 高级程序设计第9章*

引用方式:
```html
<script src="https://utils.setsuna.wang/client.js"></script>
```
或者
```js
var sss = document.createElement("script");
sss.setAttribute("src","https://utils.setsuna.wang/client.js")
document.body.append(sss)
```
然后访问`client()`或者`client().toString()`即可

>example: 
当 `navigator.userAgent` 为`"Mozilla/5.0 (iPad; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"`时,输出`操作系统:iOS 11.0 浏览器版本:Safari 11.0 设备:iPad`

## 2. emoji.js 表情对象

引用方式:
```html
<script src="https://utils.setsuna.wang/emoji.js"></script>
```
使用:
`emoji["joy"]`  得到😂
[Demo](http://utils.setsuna.wang)
![sm.ms](https://i.loli.net/2018/06/24/5b2f98fcc2903.png)

## 3. iphone.js 手机设备的API即时显示
- rotate
- touch

## 4. jianshu-index.js 给简书增加一个目录
>参考自[http://www.jianshu.com/u/c887880e8f06](http://www.jianshu.com/u/c887880e8f06)
>在他基础上增加了不少效果
- 点击锚点滚动效果
- 页面滚动时更改目录中高亮标签
- 支持三级标题
- 在文章正文中没找到 h1 时继续递归向后找 h2 \ h3

效果:

![](https://i.loli.net/2018/11/19/5bf2a7e66405b.gif)

---
## 附录: jQuery 到 JS 转换
```js
$('#el')         			|   	el.querySelector("div")    
    					|	div.querySelectorAll('.el') 
    						//getElementsByTagName 得到的是HTMLCollection,它返回的值会动态改变.参见Javascript 高级程序设计设计第284页.而 querySelectorAll 不会有这种情况发生.
//兄弟元素
$('#el').parent()			|   	el.parentNode
    					|	el.children[0]
$('#el').prev()  			|	el.previousElementSibling
$('#el').next()				|	el.nextElementSibling 
$('#el').last()				|	el.lastElementChild
$('#el').first()			| 	el.firstElementChild
$('.el').append(div) 			|	el.appendChild(document.createElement('div'))
$('.el').clone()			|	el.cloneNode(true)
$('.el').remove()			|	el.parentNode.removeChild(el)
    					|       //新增DOM 操作
    					|	el.insertAdjacentHTML("beforebegin","<p>h</p>")
					|	el.insertAdjacentHTML("afterbegin","<p>h</p>")
					|	el.insertAdjacentHTML("beforeend","<p>h</p>")
					|	el.insertAdjacentHTML("afterend","<p>h</p>")

//获取文本
$('#el').html()				|	el.innerHTML
$('#el').val()				|	el.value
$('#el').text()				|	el.textContent
$('#el').replaceWith(string)		|	el.outerHTML = string	
//创建元素
var newEl = $('') 			|	var newEl = document.createElement('div')
//Set/get属性
$('#el').attr('key', 'value')		|	el.setAttribute('key', 'value')
$('#el').attr('key')			|	el.getAttribute('key')
$('#el').addClass('class')		|	el.classList.add('class')
$('#el').removeClass('class')		|	el.classList.remove('class')
$('#el').toggleClass('class')		|	el.classList.toggle('class')
$('#el').css('border-width', '20px')	|	el.style.borderWidth = '20px'

//合并 Object
var o1 = { a: 1 };
var o2 = { b: 2 };
var o3 = { c: 3 };
var obj = Object.assign(o1, o2, o3);
console.log(obj); // { a: 1, b: 2, c: 3 }
console.log(o1);  // { a: 1, b: 2, c: 3 }, 注意目标对象自身也会改变。

//数组过滤操作
list.filter(x => x>=5)
list.slice(s,end+1)  			| list.slice(-list.length)
list.findIndex(x => x==4)  		| list.indexOf(4)

// get
var xhr = new XMLHttpRequest();
xhr.open('GET', url);
xhr.onreadystatechange = function (data) {
}
xhr.send();

// post
var xhr = new XMLHttpRequest()
xhr.open('POST', url);
xhr.onreadystatechange = function (data) {
}
xhr.send({data: data});
```
