'use strict';

var Base = require('../../ModouTask');

var Task = Base.extend({
    id: 'preference',
    name: '设置',
    position: 10,
    run: function(cons) {

        var _this = this;
        this.prompt([{
            type: 'confirm',
            name: 'savepwd',
            message: '是否保存鉴权密码(加密保存)',
            default: true
            }, {
            type: 'confirm',
            name: 'clear',
            message: '是否重置',
            default: false
        }], function(answer) {
                _this.put({
                    saveGeekPassword: answer.savepwd
                });
                if (answer.clear) {
                    _this.remove(['saveGeekPassword', 'geekPwd']);
                }
                cons();
            });

    }
});


module.exports = Task;