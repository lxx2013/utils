/**
* 简书网站左侧目录生成插件
* 代码参考了 https://github.com/vuejs/vuejs.org/blob/master/themes/vue/source/js/common.js
* @param {string} sidebarQuery - 目录 Element 的 query 字符串 ,默认值为'.sidebar'
* @param {string} contentQuery - 正文 Element 的 query 字符串 , 默认值为'.content'
*/

function initSubHeaders(sidebarQuery,contentQuery) {
    includeLinkStyle("http://localhost:3000/_sidebar.css")
    var each = [].forEach
    var sidebar = document.querySelector(sidebarQuery || '.sidebar')
    sidebar.classList.add('sidebar')
    var content = document.querySelector(contentQuery || '.content')
    content.classList.add('content-with-sidebar')

    // build sidebar
    var currentPageAnchor = sidebar.querySelector('.sidebar-link.current')
    var contentClasses = document.querySelector('.content').classList
    var isCookbookOrStyleGuide = (
        contentClasses.contains('Cookbook') ||
        contentClasses.contains('style-guide')
    )
    if (currentPageAnchor || isCookbookOrStyleGuide) {
        var allHeaders = []
        var sectionContainer
        if (isCookbookOrStyleGuide) {
            sectionContainer = document.querySelector('.menu-root')
        } else {
            sectionContainer = document.createElement('ul')
            sectionContainer.className = 'menu-sub'
            currentPageAnchor.parentNode.appendChild(sectionContainer)
        }
        var headers = content.querySelectorAll('h2')
        if (headers.length) {
            each.call(headers, function (h) {
                sectionContainer.appendChild(makeLink(h))
                var h3s = collectH3s(h)
                allHeaders.push(h)
                allHeaders.push.apply(allHeaders, h3s)
                if (h3s.length) {
                    sectionContainer.appendChild(makeSubLinks(h3s, isCookbookOrStyleGuide))
                }
            })
        } else {
            headers = content.querySelectorAll('h3')
            each.call(headers, function (h) {
                sectionContainer.appendChild(makeLink(h))
                allHeaders.push(h)
            })
        }

        var animating = false
        sectionContainer.addEventListener('click', function (e) {

            // Not prevent hashchange for smooth-scroll
            // e.preventDefault()

            if (e.target.classList.contains('section-link')) {
                sidebar.classList.remove('open')
                setActive(e.target)
                animating = true
                setTimeout(function () {
                    animating = false
                }, 400)
            }
        }, true)

        // make links clickable
        allHeaders
            .filter(function (el) {
                if (!el.querySelector('a')) {
                    return false
                }
                var demos = [].slice.call(document.querySelectorAll('demo'))
                return !demos.some(function (demoEl) {
                    return demoEl.contains(el)
                })
            })
            .forEach(makeHeaderClickable)
    }

    var hoveredOverSidebar = false
    sidebar.addEventListener('mouseover', function () {
        hoveredOverSidebar = true
    })
    sidebar.addEventListener('mouseleave', function () {
        hoveredOverSidebar = false
    })

    // listen for scroll event to do positioning & highlights
    window.addEventListener('scroll', updateSidebar)
    window.addEventListener('resize', updateSidebar)

    function updateSidebar() {
        var doc = document.documentElement
        var top = doc && doc.scrollTop || document.body.scrollTop
        if (animating || !allHeaders) return
        var last
        for (var i = 0; i < allHeaders.length; i++) {
            var link = allHeaders[i]
            if (link.offsetTop > top) {
                if (!last) last = link
                break
            } else {
                last = link
            }
        }
        if (last)
            setActive(last.id, !hoveredOverSidebar)
    }

    /**
    >为正文的标题创建一个对应的锚,返回的节点格式为`<li><a> some text </a><li>`
    @param {HTMLElement} h - 需要在目录中为其创建链接的一个标题,它的`NodeType`可能为`H1 | H2 | H3`
    @returns {HTMLElement} 返回的节点格式为`<li><a> some text </a><li>`
    */
    function makeLink(h) {
        var link = document.createElement('li')
        //window.arst = h
        var text = [].slice.call(h.childNodes).map(function (node) {
            if (node.nodeType === Node.TEXT_NODE) {
                return node.nodeValue
            } else if (['CODE', 'SPAN'].indexOf(node.tagName) !== -1) {
                return node.textContent
            } else {
                return ''
            }
        }).join('').replace(/\(.*\)$/, '')
        link.innerHTML =
            '<a class="section-link" data-scroll href="#' + h.id + '">' +
            htmlEscape(text) +
            '</a>'
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
    >为一个 `h2`标题节点收集跟在它屁股后面的 `h3`标题节点
    @param {HTMLElement}  h - HTML特殊字符
    @returns {Array} 一个由 h3节点组成的数组
    */
    function collectH3s(h) {
        var h3s = []
        var next = h.nextSibling
        while (next && next.tagName !== 'H2') {
            if (next.tagName === 'H3') {
                h3s.push(next)
            }
            next = next.nextSibling
        }
        return h3s
    }

    /**
    >创建子目录, 实际是<ul></ul>结构
    @param {Boolean} small - 控制是否是子目录,若是,则`class='munu-sub'`
    @param {Array} h3s - 由 h3 节点组成的数组
    @return {HTMLElement} `ul>li*n`
    */
    function makeSubLinks(h3s, small) {
        var container = document.createElement('ul')
        if (small) {
            container.className = 'menu-sub'
        }
        h3s.forEach(function (h) {
            container.appendChild(makeLink(h))
        })
        return container
    }

    /**
    >未知
    @param {small}  h - HTML特殊字符
    @param {Array} h3s - 由 h3 节点组成的数组
    */
    function setActive(id, shouldScrollIntoView) {
        var previousActive = sidebar.querySelector('.section-link.active')
        var currentActive = typeof id === 'string'
            ? sidebar.querySelector('.section-link[href="#' + id + '"]')
            : id
        if (currentActive !== previousActive) {
            if (previousActive) previousActive.classList.remove('active')
            currentActive.classList.add('active')
            if (shouldScrollIntoView) {
                var currentPageOffset = currentPageAnchor
                    ? currentPageAnchor.offsetTop - 8
                    : 0
                var currentActiveOffset = currentActive.offsetTop + currentActive.parentNode.clientHeight
                var sidebarHeight = sidebar.clientHeight
                var currentActiveIsInView = (
                    currentActive.offsetTop >= sidebar.scrollTop &&
                    currentActiveOffset <= sidebar.scrollTop + sidebarHeight
                )
                var linkNotFurtherThanSidebarHeight = currentActiveOffset - currentPageOffset < sidebarHeight
                var newScrollTop = currentActiveIsInView
                    ? sidebar.scrollTop
                    : linkNotFurtherThanSidebarHeight
                        ? currentPageOffset
                        : currentActiveOffset - sidebarHeight
                sidebar.scrollTop = newScrollTop
            }
        }
    }
    /**
    >让正文的标题也可以被点击
    @param {small}  h - HTML特殊字符
    @param {Array} h3s - 由 h3 节点组成的数组
    */
    function makeHeaderClickable(header) {
        var link = header.querySelector('a')
        link.setAttribute('data-scroll', '')

        // transform DOM structure from
        // `<h2><a></a>Header</a>` to <h2><a>Header</a></h2>`
        // to make the header clickable
        var nodes = Array.prototype.slice.call(header.childNodes)
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i]
            if (node !== link) {
                link.appendChild(node)
            }
        }
    }
    /**
    >在<head>中使用<link>标签引入一个外部样式文件
    @param {string} url - css文件的链接
    */
    function includeLinkStyle(url) {
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text / css";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    }
}