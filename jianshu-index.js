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
            var h1 = makeLink(h, 'a', 'h1-link')
            ul.appendChild(h1)
            allHeaders.push(h)
            //寻找h1的子标题
            var h2s = collectHs(h)
            if (h2s.length) {
                [].forEach.call(h2s, function (h2) {
                    allHeaders.push(h2)
                    var h3s = collectHs(h2)
                    h2 = makeLink(h2, 'a', 'h2-link')
                    ul.appendChild(h2)
                    //再寻找 h2 的子标题 h3
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
    //增加 click 点击处理,使用 scrollIntoView,增加控制滚动的 flag
    var scrollFlag = 0 
    sidebar.addEventListener('click', function (e) {
        e.preventDefault()
        if (e.target.href) {
            scrollFlag = 1
            setTimeout(()=>scrollFlag = 0,1000)
            setActive(e.target,sidebar)
            var target = document.getElementById(e.target.getAttribute('href').slice(1))
            target.scrollIntoView({ behavior: 'smooth', block: "center" })
        }
    })
    //监听窗口的滚动事件
    window.addEventListener('scroll', updateSidebar)
    window.addEventListener('resize', updateSidebar)
    function updateSidebar() {
        if(scrollFlag)
            return 
        var doc = document.documentElement
        var top = doc && doc.scrollTop || document.body.scrollTop
        if (!allHeaders.length) return
        var last
        for (var i = 0; i < allHeaders.length; i++) {
            var link = allHeaders[i]
            if (link.offsetTop > (top + document.body.clientHeight / 2 - 73)) {
                if (!last) { last = link }
                break
            } else {
                last = link
            }
        }
        if (last) {
            setActive(last.id, sidebar)
        }
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
    if (!h.id) h.id = IdEscape(text)
    link.innerHTML =
        `<${tag} class="${className}" href="#${h.id}">${htmlEscape(text)}</${tag}>`
    return link
}

/**
*>对 id 进行格式化.
*>注意：id值使用字符时，除了 ASCII字母和数字、“—”、“-"、"."之外，可能会引起兼容性问题，因为在HTML4中是不允许包含这些字符的，这个限制在HTML5中更加严格，为了兼容性id值必须由字母开头,同时不允许其中有空格。参考https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/id
*>但是本程序中使用了 document.getElementById 的要求稍放宽了一些,"#3.1_createComponent"这样的 id能成功执行
@param {string} text - HTML特殊字符
@returns {string} 转义后的字符,例如`<`被转义为`&lt`
*/
function IdEscape(text) {
    return text.replace(/[\s"']/g, '_') //注意这里不加 g 的话就会只匹配第一个匹配,所以会出错
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
>无论对h2还是 h3进行操作,首先都要移除所有的 active 和 current 类, 然后对 h2添加 active 和 current, 或对 h3添加 active 对其父目录添加 current
@param {small}  h - HTML特殊字符
@param {Array} h3s - 由 h3 节点组成的数组
*/
function setActive(id, sidebar) {
    //1.无论对h2还是 h3进行操作,首先都要移除所有的 active 和 current 类, 
    var previousActives = sidebar.querySelectorAll(`.active`)
    ;[].forEach.call(previousActives, function (h) {
        h.classList.remove('active')
    })
    previousActives = sidebar.querySelectorAll(`.current`)
    ;[].forEach.call(previousActives, function (h) {
        h.classList.remove('current')
    })
    //获取要操作的目录节点
    var currentActive = typeof id === 'string'
        ? sidebar.querySelector('a[href="#' + id + '"]')
        : id
    if (currentActive.classList.contains('h2-link') != -1) {
        //2. 若为 h2,则添加 active 和 current
        currentActive.classList.add('active','current')
    }
    if([].indexOf.call(currentActive.classList,'h3-link') != -1){
        //3. 若为 h3,则添加 active 且对其父目录添加 current
        currentActive.classList.add('active')
        var parent = currentActive
        while (parent && parent.tagName != 'UL'){
            parent = parent.parentNode
        }
        parent.parentNode.querySelector('.h2-link').classList.add('current','active')
    }
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
        max-width: 310px;
    }`)
    addStyle(`.menu-root { list-style:none; text-align:left }`)
    addStyle(`.menu-root .h1-link{
        display:block;
        color:rgb(44, 62, 80);
        font-family:"source sans pro", "helvetica neue", Arial, sans-serif;
        font-size:17.55px;
        font-weight:600;
        height:22px;
        line-height:22.5px;
        list-style-type:none;
        margin-block-end:17.55px;
        margin-block-start:17.55px;
    }`)
    addStyle(`.menu-root .h2-link:hover {
        border-bottom: 2px solid ${highlightColor};
    }`)
    addStyle(`.menu-root .h2-link.current+.menu-sub{
        display:block;
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
        margin-left:12.5px;
    }`)
    addStyle(`.menu-sub {
        padding-left:25px;
        list-style:none;
        display:none;
    }`)
    addStyle(`.menu-sub .h3-link{
        color:#333333;
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
    if (document.body.clientWidth <= 1300) {
        addStyle(`
        .content-with-sidebar {
            margin-left:310px !important;
        }
    `)
    }
    addStyle(`.sidebar .active{
        color:${highlightColor};
        font-weight:700;
    }`)




    /**
    >添加一条 css 规则
    @param {string} str - css样式
    */
    function addStyle(str) {
        document.styleSheets[nums - 1].insertRule(str, position++);
    }
}