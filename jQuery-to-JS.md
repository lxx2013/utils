```js
$('#el')         						|   el.querySelector("div")    
										|	div.querySelectorAll('.el')
//兄弟元素
$('#el').parent()						|   el.parentNode
$('#el').prev()  						|	el.previousElementSibling
$('#el').next()							|	el.nextElementSibling 
$('#el').last()							|	el.lastElementChild
$('#el').first()						|	el.children[0]
$('.el').append(div) 					|	el.appendChild(document.createElement('div'))
$('.el').clone()						|	el.cloneNode(true)
$('.el').remove()						|	el.parentNode.removeChild(el)

//获取文本
$('#el').html()							|	el.innerHTML
$('#el').val()							|	el.value
$('#el').text()							|	el.textContent
$('#el').replaceWith(string)			|	el.outerHTML = string	
//创建元素
var newEl = $('') 						|	var newEl = document.createElement('div')
//Set/get属性
$('#el').attr('key', 'value')			|	el.setAttribute('key', 'value')
$('#el').attr('key')					|	el.getAttribute('key')
$('#el').addClass('class')				|	el.classList.add('class')
$('#el').removeClass('class')			|	el.classList.remove('class')
$('#el').toggleClass('class')			|	el.classList.toggle('class')
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
list.slice(s,end+1)  | list.slice(-list.length)
list.findIndex(x => x==4)  | list.indexOf(4)

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