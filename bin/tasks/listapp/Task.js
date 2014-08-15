'use strict';

var TaskRunner = require('terminal-task-runner');
var Shell = TaskRunner.shell;
var Base = TaskRunner.Base;
var logger = TaskRunner.logger;


var Task = Base.extend({
    id: 'listinstalledapps',
    name: '魔豆路由上已安装的应用列表',
    position: 1,
    run: function(cons) {

        var _this = this;

        var conn = require('../../libs/modouConnector');

        var listPlugins = function() {
            var listPromise = conn.listPlugin();

            listPromise.success(function(data, resp) {
                cons(data);
            });

            listPromise.error(function(err, resp) {
                if (err instanceof Error) {
                    cons('极客模式尚未开启，请先启动魔豆路由上的极客模式');
                    return;
                }
                if (resp.statusCode === 403) {
                    this.prompt([{
                        type: 'password',
                        name: 'password',
                        message: '极客模式管理员密码：',
                        validate: function(pass) {
                            return !!pass;
                        }
                    }], function(answer) {
                            var permission = conn.askForPermission(answer.password);
                            permission.success(function() {
                                listPlugins();
                            });
                            permission.error(function() {
                                cons('尝试登录失败，请重试...');
                            });
                        });
                }
            });
        };

        listPlugins();



    }
});


module.exports = Task;