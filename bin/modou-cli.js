#!/usr/bin/env node

'use strict';

var path = require('path');
var TaskRunner = require('terminal-task-runner');
var updateNotifier = require('update-notifier');
var spinner = require("char-spinner");
var pkg = require('../package.json');
var taskList = require('./taskList');

var conn = require('./libs/modouConnector');

conn.post('http://192.168.18.1/api/auth/login', {
    password: '13795222751'
}).success(function(data) {
    conn.get('http://192.168.18.1/api/plugin/installed_plugins', data).success(function(data) {
        console.log('suc');
        console.log(data);
    }).error(function(err) {
        console.log('err');
        console.log(err);
    });
}).error(function(err) {
    console.log(err);
});




// Checks for available update and returns an instance
var notifier = updateNotifier({
    packageName: pkg.name,
    packageVersion: pkg.version,
    updateCheckInterval: 1000 * 60 * 60
});

notifier.notify();

var title = '魔豆路由控制器';
var subtitle = '使用如下功能前，请先确认已经打开了魔豆路由的极客模式';



// TaskRunner.createMenu({
//     title: title,
//     subtitle: subtitle,
//     taskDir: path.resolve(__dirname, 'tasks'),
//     taskList: taskList,
//     helpFile: path.resolve(__dirname, 'help.txt'),
//     version: 'v' + pkg.version,
//     preferenceName: '.modou'
// });
