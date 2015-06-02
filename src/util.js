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

        var queryArr = [ ];

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

        if (!queryArr.length) {
            return;
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
        send: send
    };


})(this);