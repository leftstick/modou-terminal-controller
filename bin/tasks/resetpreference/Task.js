'use strict';

var Base = require('../../ModouTask');

var Task = Base.extend({
    id: 'resetpreference',
    name: '恢复默认设置',
    position: 10,
    run: function(cons) {

        var _this = this;
        this.prompt([{
            type: 'confirm',
            name: 'clear',
            message: '是否恢复默认设置',
            default: false
        }], function(answer) {
                if (answer.clear) {
                    _this.removeAll();
                }
                cons();
            });

    }
});


module.exports = Task;