// ==UserScript==
// @name         My Greasemonkey Script
// @namespace    http://example.com/
// @version      1.0
// @description  Send a POST request in Greasemonkey script
// @match        http://example.com/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个POST请求
    function sendPostRequest(url, data) {
        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: data,
            onload: function(response) {
                console.log(response.responseText);
                // 在这里可以处理返回的响应数据
            },
            onerror: function(error) {
                console.log(error);
                // 在这里处理错误
            }
        });
    }

    // 示例调用
    var url = 'https://example.com/api';
    var postData = 'incident=8.8.8.8';
    sendPostRequest(url, postData);
})();
