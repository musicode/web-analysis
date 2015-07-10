/**
 * @file 获取点击日志
 * @author zhujl
 */
(function (global) {

    'use strict';

    /**
     * 可点击元素，需要绑定 data-click="json" 点击后会发送 json 到日志服务器
     *
     */

    var WAT = global.WAT;

    var exports = {

        action: '',

        init: function (options) {
            WAT.extend(exports, options);
        },

        /**
         * onload 事件后调用
         */
        ready: function () {

            WAT.on(
                document.body,
                'click',
                function (e) {

                    e = e || window.event;

                    var target = e.target || e.srcElement;

                    var list = [ ];

                    var clickData;

                    while (target && target.tagName) {

                        clickData =  target.getAttribute('data-click');

                        if (clickData) {
                            list.unshift(
                                WAT.parseJSON(clickData)
                            );
                        }

                        if (target.tagName === 'BODY') {
                            break;
                        }
                        else {
                            target = target.parentNode;
                        }
                    }

                    var data = { };

                    WAT.each(
                        list,
                        function (item) {
                            WAT.extend(data, item);
                        }
                    );

                    WAT.send(
                        exports.action,
                        data
                    );

                }
            );

        }

    };

    global.WAT.register('click', exports);

})(this);
