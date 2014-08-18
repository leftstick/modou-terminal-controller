'use strict';

var Base = require('terminal-task-runner').Base;

var options = {
    url: '',
    method: 'GET',
    headers: {
        'Content-type': 'application/json; charset=utf-8'
    },
    jar: true,
    encoding: 'utf-8'
};

var host = 'http://modouwifi.net';
var login = '/api/auth/login';

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

var defer = function() {
    var defered = require('terminal-task-runner').Q.defer();
    wrapperPromise(defered.promise);
    return defered;
};

var sendRequrest = function(opts) {
    var request = require('request');
    var defered = defer();

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

var upload = function(opts, data) {
    var request = require('request');
    opts.method = 'POST';
    var defered = defer();
    var _ = require('lodash');

    var r = request(opts, function(err, response, body) {
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

    var form = r.form();
    _.each(data, function(value, key) {
        if (value.call) {
            form.append(key, value());
            return;
        }
        form.append(key, value);
    });
    return defered.promise;
};

var encode = function(str) {
    return new Buffer(str).toString('base64');
};

var decode = function(str) {
    return new Buffer(str, 'base64').toString();
};

var permission = function(defered, recall, password) {
    var _this = this;
    var save = _this.get('saveGeekPassword', false);
    if (save) {
        _this.put({
            geekPwd: encode(password)
        });
    }
    var permission = _this.ajaxPost(login, {
        password: password
    })();
    permission.success(function() {
        recall();
    });
    permission.error(function() {
        _this.remove(['geekPwd']);
        defered.reject('PASSWORDERROR');
    });
    return permission;
};


var ModouTask = Base.extend({

    ajaxGet: function(url, data) {
        return function() {
            var _ = require('lodash');
            var opts = _.defaults({
                url: host + url
            }, options);

            return sendRequrest(opts);
        };
    },
    ajaxPost: function(url, data) {
        return function() {
            var _ = require('lodash');
            var opts = _.defaults({
                url: host + url,
                method: 'POST',
                body: JSON.stringify(data || '')
            }, options);

            return sendRequrest(opts);
        };
    },
    upload: function(url, data) {
        return function() {
            var opts = {
                url: host + url,
                jar: true
            };
            return upload(opts, data);
        };
    },

    doModou: function(func) {
        var _this = this;
        var defered = defer();

        var recall = function() {

            var promise = func();

            promise.success(function(resp) {
                defered.resolve(resp);
            });

            promise.error(function(err) {
                if (err instanceof Error) {
                    defered.reject('GEEKDISABLED');
                    return;
                }
                if (err.response.statusCode === 403) {
                    var savedPwd = _this.get('geekPwd');
                    if (savedPwd) {
                        savedPwd = decode(savedPwd);
                        permission.bind(_this)(defered, recall, savedPwd);
                        return;
                    }

                    _this.prompt([{
                        type: 'password',
                        name: 'password',
                        message: '极客模式管理员密码',
                        validate: function(pass) {
                            return !!pass;
                        }
                    }], function(answer) {
                            permission.bind(_this)(defered, recall, answer.password);
                        });
                    return;
                }
                defered.reject(err);
            });
        };

        recall();

        return defered.promise;
    }
});


module.exports = ModouTask;