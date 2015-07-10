/**
 * @file 工具方法
 * @author zhujl
 */
(function (global) {

    'use strict';

    /**
     * 绑定事件
     *
     * @inner
     * @type {Function}
     */
    var on;

    /**
     * 解绑事件
     *
     * @inner
     * @type {Function}
     */
    var off;

    if (window.addEventListener) {
        on = function (element, type, handler) {
            element.addEventListener(type, handler, false);
        };
        off = function (element, type, handler) {
            element.removeEventListener(type, handler);
        };
    }
    else {
        on = function (element, type, handler) {
            element.attachEvent('on' + type, handler);
        };
        off = function (element, type, handler) {
            element.detachEvent('on' + type, handler);
        };
    }

    /**
     * 遍历对象
     *
     * @inner
     * @param {Object} target
     * @param {Function} callback
     */
    function each(target, callback) {
        if (typeof target.pop === 'function') {
            for (var i = 0, len = target.length; i < len; i++) {
                callback(target[i], i);
            }
        }
        else {
            for (var key in target) {
                if (target.hasOwnProperty(key)) {
                    callback(target[key], key);
                }
            }
        }
    }

    /**
     * 扩展对象
     *
     * @inner
     * @param {Object} target
     * @param {Object=} source
     */
    function extend(target, source) {
        if (source) {
            each(
                source,
                function (value, key) {
                    target[key] = value;
                }
            );
        }
    }

    /**
     * 解析 json 对象
     *
     * @inner
     * @param {string} json
     * @return {Object}
     */
    function parseJSON(json) {
        try {
            return (new Function('return ' + json))();
        }
        catch (e) {
            return { };
        }
    }

    /**
     * 读取 cookie 值
     *
     * @inner
     * @param {string} name
     * @return {string}
     */
    function getCookie(name) {
        var regex = new RegExp(name + '=([^;]+)(?:;|$)');
        var match = document.cookie.match(regex);
        return match ? decodeURIComponent(match[1]) : '';
    }

    /**
     * 设置 cookie
     *
     * @inner
     * @param {string} name
     * @param {string} value
     * @param {Object=} options
     */
    function setCookie(name, value, options) {

        options = options || { };

        var expires = options.expires;
        if (expires == null) {
            // 永不过期，2 到底
            expires = new Date(2222, 2, 2);
        }

        var path = options.path;
        if (path == null) {
            // 保证网站全局可用
            path = '/';
        }

        var domain = options.domain;
        if (domain == null) {
            // 保证网站全局可用
            var terms = location.hostname.split('.');
            if (terms.length > 2) {
                terms.shift();
            }
            domain = terms.join('.');
        }

        document.cookie = [
            encodeURIComponent(name), '=', encodeURIComponent(value),
            ';expires=' + expires.toUTCString(),
            ';path=' + path,
            ';domain=' + domain,
            options.secure ? ';secure' : ''
        ].join('');
    }

    /**
     * 生成四位十六进制随机数
     *
     * @inner
     * @return {string}
     */
    function s4() {
       return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    /**
     * 创建一个 guid
     *
     * @inner
     * @return {string}
     */
    function guid() {
        return [
            s4() + s4(),
            s4(),
            s4(),
            s4(),
            s4() + s4() + s4()
        ].join('-');
    }

    /**
     * 创建完整 url
     *
     * @inner
     * @param {string} host
     * @param {string} path
     * @return {string}
     */
    function toUrl(host, path) {
        return location.protocol + '//' + host + path;
    }

    /**
     * 保持图片引用的数组
     *
     * @inner
     * @type {Array.<Image>}
     */
    var imageList = [ ];

    /**
     * 发送请求
     *
     * @inner
     * @param {string} url 请求 url
     * @param {Object} data 请求数据
     */
    var send = function (url, data) {

        if (!url) {
            return;
        }

        var queryArr = [ ];

        if (data) {
            each(
                data,
                function (value, name) {
                    if (value !== null) {
                        queryArr.push(
                            name + '=' + encodeURIComponent(value)
                        );
                    }
                }
            );
        }

        var img = new Image();

        // 保持引用
        var index = imageList.push(img) - 1;

        img.onload =
        img.onerror = function () {
            // 清除引用
            img =
            img.onload =
            img.onerror = null;
            delete imageList[index];
        };

        // 加时间戳
        queryArr.push('_t=' + (+new Date()).toString(36));

        img.src = url + '?' + queryArr.join('&');

    };


    global.WAT = {
        on: on,
        off: off,
        each: each,
        extend: extend,
        parseJSON: parseJSON,
        getCookie: getCookie,
        setCookie: setCookie,
        guid: guid,
        toUrl: toUrl,
        send: send
    };


})(this);