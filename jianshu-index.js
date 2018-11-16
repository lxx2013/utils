// ==UserScript==
// @name         简书目录
// @description:zh-cn 自动生成简书目录
// @namespace    http://www.jianshu.com/u/c887880e8f06
// @version      1.0
// @description  create content
// @author       Wonder233
// @match        http://www.jianshu.com/p/*
// @match        https://www.jianshu.com/p/*
//// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// ==/UserScript==
var menuIndex = 0; //初始化标题索引
var highlightColor = "#c7254e";
// 在侧边栏中添加目录项
function appendMenuItem(tagName, id, content) {
    console.log(tagName + " " + tagName.substring(1));
    let i = tagName.substring(1)
    let paddingLeft = i * 10; //添加标题缩进
    let weights = [700, 600, 500, 400, 400, 400];
    let sizes = ['24px', '20px', '18px', '16px', '14px', '12px']
    $('#menu_nav_ol').append(`<li class="${id}" style="padding-left:${paddingLeft}px;overflow:hidden;text-overflow:ellipsis;">
                                <b  class="${tagName}" style="font-weight:${weights[i]}; font-size:${sizes[i]};white-space:nowrap;">
                                   ${content}
                                </b>
                              </li>`);
}

(function () {
    'use strict';
    // 使文章区域宽度适配屏幕
    let wider = $('.note').width() - 400;
    let oriWidth = $('.post').width();
    console.log(wider);
    console.log(oriWidth);
    if (wider < oriWidth) {
        wider = oriWidth;
    }
    // 适配宽度
    $('.post').width(wider);

    // 保存标题元素
    let titles = $('body').find('h1,h2,h3,h4,h5,h6');
    if (titles.length === 0) {
        return;
    }
    // 将文章内容右移
    $('.post').css('padding-left', '200px');
    // 在 body 标签内部添加 aside 侧边栏,用于显示文档目录
    let contentHeight = window.innerHeight; //设置目录高度
    let asideContent = '<aside id="sideMenu" style="position: fixed;padding: 80px 15px 20px 15px;top: 0;left: 0;margin-bottom:20px;background-color: #eee;background-color: #eee;z-index: 810;overflow: scroll;max-height:' + contentHeight + 'px;min-height:' + contentHeight + 'px;min-width:350px;max-width:350px;"><h2>目录<h2></aside>';
    $('.show-content').prepend(asideContent);
    $('#sideMenu').append('<ol id="menu_nav_ol" style="list-style:none;margin:0px;padding:0px;">');// 不显示 li 项前面默认的点标志, 也不使用默认缩进

    // 遍历文章中的所有标题行, 按需添加id值, 并增加记录到目录列表中
    titles.each(function () {
        let tagName = $(this)[0].tagName.toLocaleLowerCase();
        let content = $(this).text();
        // 若标题的id不存在,则使用新id
        let newTagId = $(this).attr('id');
        if (!$(this).attr('id')) {
            newTagId = 'id_' + menuIndex;
            $(this).attr('id', newTagId);
            menuIndex++;
        }
        if (newTagId !== 'id_0') //忽略标题
            appendMenuItem(tagName, newTagId, content);
    });

    $('#sideMenu').append('</ol>');
    // 绑定目录li点击事件,点击时跳转到对应的位置
    $('#menu_nav_ol li').on('click', function () {
        let targetId = $(this).attr('class');
        $("#" + targetId)[0].scrollIntoView({ behavior: 'smooth' });
    });
    window.onscroll = function () {
        if (window.scrollY + document.body.clientHeight / 2 >= $('#id_15')[0].offsetTop) {

        }
    }
    try {
        // 设置 hover 高亮样式
        var nums = document.styleSheets.length;
        var position = document.styleSheets[nums - 1].cssRules.length
        document.styleSheets[nums - 1].insertRule(`#menu_nav_ol li:hover b{ border-bottom: 2px solid ${highlightColor};cursor:pointer;}`, position++);
        document.styleSheets[nums - 1].insertRule(`#menu_nav_ol .active {color:${highlightColor};font-weight: 600;}`, position++);
        document.styleSheets[nums - 1].insertRule(`#menu_nav_ol .h1 {font-weight: 600;color: #2c3e50;font-size:1.17em}`, position++);
        document.styleSheets[nums - 1].insertRule(`#menu_nav_ol .h2 {color: #7f8c8d;font-size:1em;}`, position++);
        document.styleSheets[nums - 1].insertRule(`#menu_nav_ol .h3 {color:${highlightColor};}`, position++);
    }
    catch (err) {
        console.log('[目录插件] 设置 hover 样式 Error\n', err)
    }
})();
