'use strict';

var Base = require('../../ModouTask');

var Task = Base.extend({
    id: 'preference',
    name: '设置',
    position: 9,
    run: function(cons) {

        var _this = this;
        this.prompt([{
            type: 'confirm',
            name: 'savepwd',
            message: '是否保存鉴权密码(加密保存)',
            default: true
        }], function(answer) {
                _this.put({
                    saveGeekPassword: answer.savepwd
                });
                cons();
            });

    }
});


module.exports = Task;