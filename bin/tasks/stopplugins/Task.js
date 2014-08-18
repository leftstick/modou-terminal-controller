'use strict';

var Base = require('../../libs/RunningStatusTask');

var Task = Base.extend({
    id: 'stopplugins',
    name: '停用插件',
    api: '/api/plugin/stop_plugin',
    operTxt: '停用',
    status: true,
    position: 5
});


module.exports = Task;