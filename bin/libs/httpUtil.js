'use strict';

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

var httpUtil = {
    defer: function() {
        var defered = require('terminal-task-runner').Q.defer();
        wrapperPromise(defered.promise);
        return defered;
    }
};


module.exports = httpUtil;