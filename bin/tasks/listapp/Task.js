'use strict';

var TaskRunner = require('terminal-task-runner');
var Shell = TaskRunner.shell;
var Base = TaskRunner.Base;
var logger = TaskRunner.logger;


var options = {
    url: 'http://192.168.18.1/api/plugin/installed_plugins',
    method: 'GET',
    headers: {
        'Content-type': 'application/json; charset=utf-8'
    },
    auth: {
        user: '',
        pass: '',
        sendImmediately: true
    },
    encoding: 'utf-8'
};


var Task = Base.extend({
    id: 'listinstalledapps',
    name: '魔豆路由上已安装的应用列表',
    position: 1,
    run: function(cons) {

        var request = require('request');

        var _this = this;

        this.prompt([{
            type: 'input',
            name: 'username',
            message: '极客模式管理员用户名：',
            default: _this.get('modouadmin', 'matrix')
            }, {
            type: 'password',
            name: 'password',
            message: '极客模式管理员密码：',
            validate: function(pass) {
                return !!pass;
            }
        }], function(answer) {
                options.auth.user = answer.username;
                options.auth.pass = answer.password;
                console.log(options);
                _this.put({
                    modouadmin: answer.username
                });


                request(options, function(err, incoming, response) {
                    console.log(response);
                    if (err) {
                        cons(err);
                        return;
                    }
                    var res = JSON.parse(response);
                    if (res.code !== 0 || typeof res.code === 'undefined') {
                        cons(res.msg || res.errmsg);
                        return;
                    }

                    logger.info(res.plugins);
                    cons();
                });

            });

    }
});


module.exports = Task;