'use strict';

var Base = require('../../ModouTask');
var logger = require('terminal-task-runner').logger;
var Q = require('terminal-task-runner').Q;

var list_plugins = '/api/plugin/installed_plugins';
var uninstall_plugin = '/api/plugin/uninstall_plugin';

var Task = Base.extend({
    id: 'deleteInstallplugins',
    name: '删除魔豆上已安装的插件',
    position: 1,
    run: function(cons) {

        var _this = this;

        var listPromise = this.doModou(this.get(list_plugins));

        listPromise.success(function(resp) {
            var plugins = resp.data.plugins;
            plugins.forEach(function(plugin) {
                plugin.value = plugin.id;
            });

            if (plugins.length === 0) {
                logger.warn('您还没有安装任何插件');
                cons();
                return;
            }

            _this.prompt([{
                type: 'checkbox',
                name: 'plugins',
                message: "已安装的插件列表",
                choices: plugins
            }], function(answer) {
                    if (!answer.plugins || !answer.plugins.length) {
                        logger.warn('您没有选中任何插件');
                        cons();
                        return;
                    }

                    var promises = answer.plugins.map(function(plugin) {
                        return _this.doModou(_this.post(uninstall_plugin, {
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