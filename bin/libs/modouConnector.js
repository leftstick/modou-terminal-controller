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
    encoding: 'utf-8'
};

var host = 'http://192.168.18.1';

//api
var login = '/api/auth/login';
var list_plugins = '/api/plugin/installed_plugins';

var wrapperPromise = function(promise) {
    promise.success = function(fn) {
        promise.then(function(data) {
            fn(data);
        });
        return promise;
    };

    promise.error = function(fn) {
        promise.then(null, function(err) {
            fn(err);
        });
        return promise;
    };

};

var get = function(url, data) {
    var opts = _.defaults({
        url: url,
        headers: {
            Cookie: data
        }
    }, options);

    var defered = TaskRunner.Q.defer();
    var promise = defered.promise;
    wrapperPromise(promise);

    request(opts, function(err, incoming, response) {
        if (err) {
            defered.reject(err);
            return;
        }
        var res = JSON.parse(response);
        if (typeof res.code === 'undefined' || res.code !== 0) {
            defered.reject(res.msg || res.errmsg);
            return;
        }
        defered.resolve(res);
    });

    return promise;
};

var post = function(url, data) {
    var opts = _.defaults({
        url: url,
        method: 'POST',
        body: JSON.stringify(data)
    }, options);
    var defered = TaskRunner.Q.defer();
    var promise = defered.promise;
    wrapperPromise(promise);

    request(opts, function(err, incoming, response) {
        if (err) {
            defered.reject(err);
            return;
        }
        var res = JSON.parse(response);
        if (typeof res.code === 'undefined' || res.code !== 0) {
            defered.reject(res.msg || res.errmsg);
            return;
        }
        defered.resolve(incoming.headers['set-cookie'][0]);
    });

    return promise;
}

var connector = {
    get: get,
    post: post,
    checkEnv: function() {}
};

module.exports = connector;