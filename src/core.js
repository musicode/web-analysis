/**
 * @file 主模块
 * @author zhujl
 */
(function (global) {

    'use strict';

    var WAT = global.WAT;

    var exports = {

        /**
         * 当前版本
         *
         * @type {string}
         */
        version: '0.0.7',

        /**
         * 页面 url
         *
         * @type {string}
         */
        pageUrl: document.URL,

        /**
         * 来源
         *
         * @type {string}
         */
        referrer: document.referrer,

        /**
         * 发送日志的地址
         *
         * @type {string}
         */
        url: '',

        /**
         * 插件
         *
         * @type {Object}
         */
        plugins: { },

        /**
         * 初始化，入口方法
         *
         * @param {Object} options 用户配置
         * @param {string} options.url 发送日志地址
         * @param {Object} options.data 需要发送的数据，比如 productName sessionId 之类的
         */
        init: function (options) {

            WAT.each(
                options,
                function (value, name) {
                    var plugin = exports.plugins[name];
                    if (plugin && typeof plugin.init === 'function') {
                        plugin.init(value);
                    }
                    else {
                        exports[name] = value;
                    }
                }
            );

        },

        /**
         * 页面 load 之后执行
         */
        ready: function () {

            var data = {
                pageUrl: exports.pageUrl,
                referrer: exports.referrer
            };

            WAT.extend(data, exports.data);

            WAT.each(
                exports.plugins,
                function (plugin, name) {
                    if (typeof plugin.ready === 'function') {
                        plugin.ready();
                        WAT.extend(data, plugin.data);
                    }
                }
            );

            exports.info(data);
        },

        /**
         * 注册插件
         *
         * @param {string} name 插件名称
         * @param {Object} plugin 插件对象
         */
        register: function (name, plugin) {
            exports.plugins[name] = plugin;
        }

    };

    WAT.each(
        ['debug', 'info', 'warning', 'error'],
        function (type) {
            exports[type] = function (data) {
                var url = exports.url;
                if (url) {
                    data.logType = type;
                    data.pageUrl = exports.pageUrl;
                    WAT.send(url, data);
                }
            };
        }
    );

    WAT.extend(WAT, exports);



    if (document.readyState === 'complete') {
        setTimeout(exports.ready, 0);
    }
    else {
        /// 在触发 load 事件后发送数据
        WAT.on(window, 'load', function pageReady() {

            WAT.off(window, 'load', pageReady);

            // 使用延时的理由
            // 1. 不跟业务代码抢 onload 时间点，页面尽早可交互
            // 2. firstPaint（白屏时间）在 onload 读取可能是 0
            setTimeout(
                exports.ready,
                200
            );

        });
    }

    // 监控 js 报错
    WAT.on(window, 'error', function (e) {

        var data = {
            from: 'js'
        };

        // IE 可能是字符串
        if (!e || typeof e === 'string') {
            e = window.event;
            data.msg = e.errorMessage;
            data.line = e.errorLine;
            data.col = e.errorCharacter;
        }
        else {
            data.msg = e.message;
            data.line = e.lineno;
            data.col = e.colno;
        }

        exports.error(data);

    });


})(this);