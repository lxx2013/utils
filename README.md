# utils
# 供CDN方式调用的工具代码

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

## 1. emoji.js 表情对象

引用方式:
```html
<script src="https://utils.setsuna.wang/emoji.js"></script>
```
使用:
`emoji["joy"]`  得到😂
[Demo](http://utils.setsuna.wang)
[sm.ms](https://i.loli.net/2018/06/24/5b2f98fcc2903.png
)