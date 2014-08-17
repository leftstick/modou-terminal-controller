'use strict';

var Base = require('../../ModouTask');
var logger = require('terminal-task-runner').logger;

var list_plugins = '/api/plugin/installed_plugins';

var Task = Base.extend({
    id: 'listinstalledplugins',
    name: '魔豆上已安装的插件列表',
    position: 1,
    run: function(cons) {

        var _this = this;

        var listPromise = this.doModou(this.get(list_plugins));

        listPromise.success(function(resp) {
            var Table = require('cli-table');
            var table = new Table({
                head: ['名称', '作者', '版本', '大小', '描述', '状态']
            });
            var plugins = resp.data.plugins;
            plugins.forEach(function(plugin) {
                table.push([plugin.name, plugin.author, plugin.version, plugin.size, plugin.description, plugin.isRunning ? '启用' : '停用']);
            });
            logger.warn(table.toString());
            cons();
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