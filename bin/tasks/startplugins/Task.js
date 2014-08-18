'use strict';

var Base = require('../../libs/RunningStatusTask');

var Task = Base.extend({
    id: 'startplugins',
    name: '启用插件',
    api: '/api/plugin/start_plugin',
    operTxt: '启用用',
    status: false,
    position: 4
});



module.exports = Task;