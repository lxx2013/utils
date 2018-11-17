// ==UserScript==
// @name         自己的目录插件测试
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://www.jianshu.com/p/*
// @match        https://www.jianshu.com/p/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    initSidebar('.sidebar', '.post');
})();

/**
* 简书网站左侧目录生成插件
* 代码参考了 https://github.com/vuejs/vuejs.org/blob/master/themes/vue/source/js/common.js
* @param {string} sidebarQuery - 目录 Element 的 query 字符串 
* @param {string} contentQuery - 正文 Element 的 query 字符串
*/
function initSidebar(sidebarQuery, contentQuery) {
    addAllStyle()
    var body = document.body
    var sidebar = document.querySelector(sidebarQuery)
    // 在 body 标签内部添加 div.sidebar 侧边栏,用于显示文档目录
    if (!sidebar) {
        sidebar = document.createElement('div')
        body.insertBefore(sidebar, body.firstChild)
    }
    sidebar.classList.add('sidebar')
    var content = document.querySelector(contentQuery)
    if (!content) {
        throw ('Error: content not find!')
        return
    }
    content.classList.add('content-with-sidebar');
    var ul = document.createElement('ul')
    ul.classList.add('menu-root')
    sidebar.appendChild(ul)

    var allHeaders = []
    // 遍历文章中的所有 h1或 h2(取决于最大的 h 是多大) , 编辑为li.h3插入 ul
    var i = 1
    var headers = content.querySelectorAll('h' + i++)
    while (!headers.length) {
        headers = content.querySelectorAll('h' + i++)
    }
    if (headers.length) {
        [].forEach.call(headers, function (h) {
            var h1 = makeLink(h, 'a','h1-link')
            ul.appendChild(h1)
            allHeaders.push(h)
            //寻找h1的子标题
            var h2s = collectHs(h)
            if (h2s.length) {
                [].forEach.call(h2s, function (h2) {
                    allHeaders.push(h2)
                    h2 = makeLink(h2, 'a', 'h2-link')
                    ul.appendChild(h2)
                    //再寻找 h2 的子标题 h3
                    var h3s = collectHs(h2)
                    if (h3s.length) {
                        var subUl = document.createElement('ul')
                        subUl.classList.add('menu-sub')
                        h2.appendChild(subUl)
                            ;[].forEach.call(h3s, function (h3) {
                                allHeaders.push(h3)
                                h3 = makeLink(h3, 'a', 'h3-link')
                                subUl.appendChild(h3)
                            })
                    }
                })
            }
        })
    }
    //增加 click 点击处理,使用 scrollIntoView
    sidebar.addEventListener('click', function (e) {
        e.preventDefault()
        if (e.target.href) {
            //setActive(e.target,sidebar)
            var target = document.getElementById(e.target.getAttribute('href').slice(1))
            target.scrollIntoView({ behavior: 'smooth' })
        }
    })
    //监听窗口的滚动事件
    window.addEventListener('scroll', updateSidebar)
    window.addEventListener('resize', updateSidebar)
    function updateSidebar() {
        var doc = document.documentElement
        var top = doc && doc.scrollTop || document.body.scrollTop
        if (!allHeaders.length) return
        var last
        for (var i = 0; i < allHeaders.length; i++) {
            var link = allHeaders[i]
            if (link.offsetTop > (top+document.body.clientHeight/3)) {
                if (!last){ last = link }
                break
            } else {
                last = link
            }
        }
        if (last)
            setActive(last.id,sidebar)
    }
}

/**
>为正文的标题创建一个对应的锚,返回的节点格式为`<li><tag class="className"> some text </tag><li>`
@param {HTMLElement} h - 需要在目录中为其创建链接的一个标题,它的`NodeType`可能为`H1 | H2 | H3`
@param {string} tag - 返回的 li 中的节点类型, 默认为 a
@param {string} className - 返回的 tag 的 class ,默认为空
@returns {HTMLElement} 返回的节点格式为`<li><a> some text </a><li>`
*/
function makeLink(h, tag, className) {
    tag = tag || 'a'
    className = className || ''
    var link = document.createElement('li')
    var text = [].slice.call(h.childNodes).map(function (node) {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.nodeValue
        } else if (['CODE', 'SPAN'].indexOf(node.tagName) !== -1) {
            return node.textContent
        } else {
            return ''
        }
    }).join('').replace(/\(.*\)$/, '')
    if (!h.id) h.id = text.replace(/\s/, '_')
    link.innerHTML =
        `<${tag} class="${className}" href="#${h.id}">${htmlEscape(text)}</${tag}>`
    return link
}
/**
>HTML 特殊字符[ &, ", ', <, > ]转义
@param {string} text - HTML特殊字符
@returns {string} 转义后的字符,例如`<`被转义为`&lt`
*/
function htmlEscape(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
}
/**
>为一个 `h(x)`标题节点收集跟在它屁股后面的 `h(x+1)`标题节点
@param {HTMLElement}  h - HTML 标题节点
@returns {Array} 一个由 h(x+1)节点组成的数组
*/
function collectHs(h) {
    var h3s = []
    var thisTag = h.tagName
    var childTag = h.tagName[0] + (parseInt(h.tagName[1]) + 1)
    var next = h.nextSibling
    while (next && next.tagName !== thisTag) {
        if (next.tagName === childTag) {
            h3s.push(next)
        }
        next = next.nextSibling
    }
    return h3s
}
/**
>未知
@param {small}  h - HTML特殊字符
@param {Array} h3s - 由 h3 节点组成的数组
*/
function setActive(id,sidebar) {
    var previousActives = sidebar.querySelectorAll('.active')
    ;[].forEach.call(previousActives,function(h){
        h.classList.remove('active')
    })
    var currentActive = typeof id === 'string'
        ? sidebar.querySelector('a[href="#' + id + '"]')
        : id
    currentActive.classList.add('active')
}
/**
>增加 sidebar 需要的全部样式
@param {string} highlightColor - 高亮颜色, 默认为'#c7254e'
*/
function addAllStyle(highlightColor) {
    var nums = document.styleSheets.length;
    var position = document.styleSheets[nums - 1].cssRules.length
    highlightColor = highlightColor || "#c7254e"
    addStyle(`.sidebar{position:fixed;    z-index: 10;
        top: 61px;
        left: 0;
        bottom: 0;
        overflow-x: hidden;
        overflow-y: auto;
        padding: 40px 20px 60px 30px;
        max-width: 280px;
    }`)
    addStyle(`.menu-root { list-style:none; text-align:left }`)
    addStyle(`.menu-root .h1-link{
        color:rgb(44, 62, 80);
        display:block;
        font-family:"source sans pro", "helvetica neue", Arial, sans-serif;
        font-size:17.55px;
        font-weight:600;
        height:22px;
        line-height:22.5px;
        list-style-type:none;
        margin-block-end:17.55px;
        margin-block-start:17.55px;
    }`)
    addStyle(`.menu-root .h2-link{
        color:rgb(127,140,141);
        cursor:pointer;
        font-family:"source sans pro", "helvetica neue", Arial, sans-serif;
        font-size:15px;
        height:auto;
        line-height:22.5px;
        list-style-type:none;
        text-align:left;
        text-decoration-color:rgb(127, 140, 141);
        text-decoration-line:none;
        text-decoration-style:solid;
        padding-left:12.5px;
    }`)
    addStyle(`.menu-sub {
        padding-left:25px;
    }`)
    addStyle(`.menu-sub .h3-link{
        color:rgb(52, 73, 94);
        cursor:pointer;
        display:inline;
        font-family:"source sans pro", "helvetica neue", Arial, sans-serif;
        font-size:12.75px;
        height:auto;
        line-height:19.125px;
        list-style-type:none;
        text-align:left;
        text-decoration-color:rgb(52, 73, 94);
        text-decoration-line:none;
        text-decoration-style:solid;
    }`)
    if (document.body.clientWidth<= 1300) {
        addStyle(`
        .content-with-sidebar {
            margin-left:310px !important;
        }
    `)
    }
    addStyle(`.sidebar .active{
        color:${highlightColor};
    }`)




    /**
    >添加一条 css 规则
    @param {string} str - css样式
    */
    function addStyle(str) {
        document.styleSheets[nums - 1].insertRule(str, position++);
    }
}
