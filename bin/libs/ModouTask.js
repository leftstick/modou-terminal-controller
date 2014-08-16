'use strict';

var Base = require('terminal-task-runner').Base;


var ModouTask = Base.extend({

    doModou: function(func) {
        var _this = this;
        var conn = require('./modouConnector');
        var defered = require('./httpUtil').defer();

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
                    _this.prompt([{
                        type: 'password',
                        name: 'password',
                        message: '极客模式管理员密码',
                        validate: function(pass) {
                            return !!pass;
                        }
                    }], function(answer) {
                            var permission = conn.askForPermission(answer.password);
                            permission.success(function() {
                                recall();
                            });
                            permission.error(function() {
                                defered.reject('PASSWORDERROR');
                            });
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