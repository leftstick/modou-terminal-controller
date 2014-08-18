'use strict';

var Base = require('../ModouTask');
var logger = require('terminal-task-runner').logger;
var Q = require('terminal-task-runner').Q;

var list_plugins = '/api/plugin/installed_plugins';
var stop_plugin = '/api/plugin/stop_plugin';

var endswith = function(src, str) {
    var reg = new RegExp(str + '$');
    return reg.test(src);
};

var Task = Base.extend({
    operTxt: '',
    api: '',
    status: false,
    run: function(cons) {

        var _this = this;

        var listPromise = this.doModou(this.ajaxGet(list_plugins));

        listPromise.success(function(resp) {
            var plugins = resp.data.plugins;

            var stopped = plugins.filter(function(plugin) {
                return plugin.isRunning === _this.status;
            });

            if (stopped.length === 0) {
                logger.warn('您没有任何插件需要' + _this.operTxt);
                cons();
                return;
            }

            stopped.forEach(function(plugin) {
                plugin.value = plugin.id;
            });
            _this.prompt([{
                type: 'checkbox',
                name: 'ids',
                message: '选择需要' + _this.operTxt + '的插件',
                choices: stopped
            }], function(answer) {
                    if (!answer.ids || !answer.ids.length) {
                        logger.warn('您没有选中任何插件');
                        cons();
                        return;
                    }

                    var promises = answer.ids.map(function(plugin) {
                        return _this.doModou(_this.ajaxPost(_this.api, {
                            id: plugin
                        }));
                    });

                    Q.all(promises).then(function() {
                        cons();
                    }, function(err) {
                            cons(err.msg);
                        });
                });

        });

        listPromise.error(function(err) {
            if (err === 'GEEKDISABLED') {
                cons('极客模式尚未开启，请先启动魔豆路由上的极客模式');
                return;
            }
            if (err === 'PASSWORDERROR') {
                cons('尝试登录失败，请重试...');
                return;
            }
        });

    }
});


module.exports = Task;