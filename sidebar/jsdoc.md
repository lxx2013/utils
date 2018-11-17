<a name="initSubHeaders"></a>

## initSubHeaders(sidebarQuery, contentQuery)
简书网站左侧目录生成插件
代码参考了 https://github.com/vuejs/vuejs.org/blob/master/themes/vue/source/js/common.js

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| sidebarQuery | <code>string</code> | 默认值为'.sidebar' |
| contentQuery | <code>string</code> | 默认值为'.content' |


* [initSubHeaders(sidebarQuery, contentQuery)](#initSubHeaders)
    * [~currentPageAnchor](#initSubHeaders..currentPageAnchor) : <code>HTMLElement</code>
    * [~makeLink(h)](#initSubHeaders..makeLink) ⇒ <code>HTMLElement</code>
    * [~htmlEscape(text)](#initSubHeaders..htmlEscape) ⇒ <code>string</code>

<a name="initSubHeaders..currentPageAnchor"></a>

### initSubHeaders~currentPageAnchor : <code>HTMLElement</code>
**Kind**: inner property of [<code>initSubHeaders</code>](#initSubHeaders)  
<a name="initSubHeaders..makeLink"></a>

### initSubHeaders~makeLink(h) ⇒ <code>HTMLElement</code>
a quite wonderful function

**Kind**: inner method of [<code>initSubHeaders</code>](#initSubHeaders)  

| Param | Type | Description |
| --- | --- | --- |
| h | <code>HTMLElement</code> | 需要在目录中为其创建链接的一个标题,它的`NodeType`可能为`H1 | H2 | H3` |

<a name="initSubHeaders..htmlEscape"></a>

### initSubHeaders~htmlEscape(text) ⇒ <code>string</code>
>HTML 特殊字符[ &, ", ', <, > ]转义

**Kind**: inner method of [<code>initSubHeaders</code>](#initSubHeaders)  
**Returns**: <code>string</code> - 转义后的字符,例如`<`被转义为`&lt`  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | HTML特殊字符 |

