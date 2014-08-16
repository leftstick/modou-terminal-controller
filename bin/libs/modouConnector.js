'use strict';

var request = require('request');
var _ = require('lodash');
var TaskRunner = require('terminal-task-runner');


var options = {
    url: '',
    method: 'GET',
    headers: {
        'Content-type': 'application/json; charset=utf-8'
    },
    jar: true,
    encoding: 'utf-8'
};

var host = 'http://192.168.18.1';

//api
var login = '/api/auth/login';
var list_plugins = '/api/plugin/installed_plugins';


var get = function(url, data) {
    var opts = _.defaults({
        url: host + url
    }, options);

    var defered = require('./httpUtil').defer();

    request(opts, function(err, response, body) {
        if (err) {
            defered.reject(err);
            return;
        }
        var res = JSON.parse(body);
        if (typeof res.code === 'undefined' || res.code !== 0) {
            defered.reject({
                msg: res.msg || res.errmsg,
                response: response
            });
            return;
        }
        defered.resolve({
            data: res,
            response: response
        });
    });

    return defered.promise;
};

var post = function(url, data) {
    var opts = _.defaults({
        url: host + url,
        method: 'POST',
        body: JSON.stringify(data || '')
    }, options);
    var defered = require('./httpUtil').defer();

    request(opts, function(err, response, body) {
        if (err) {
            defered.reject(err);
            return;
        }
        var res = JSON.parse(body);
        if (typeof res.code === 'undefined' || res.code !== 0) {
            defered.reject({
                msg: res.msg || res.errmsg,
                response: response
            });
            return;
        }
        defered.resolve({
            data: res,
            response: response
        });
    });

    return defered.promise;
};

var connector = {
    askForPermission: function(password) {
        return post(login, {
            password: password
        });
    },
    listPlugin: function() {
        return get(list_plugins);
    }
};

module.exports = connector;