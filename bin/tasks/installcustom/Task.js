'use strict';

var Base = require('../../ModouTask');

var install_custom_plugin = '/api/plugin/install_custom';

var endswith = function(src, str) {
    var reg = new RegExp(str + '$');
    return reg.test(src);
};

var Task = Base.extend({
    id: 'installcustomm',
    name: '安装非认证的插件',
    position: 2,
    run: function(cons) {

        var _this = this;
        var fs = require('fs');

        this.prompt([{
            type: 'input',
            name: 'name',
            message: '插件名称',
            validate: function(pass) {
                return !!pass;
            }
            }, {
            type: 'input',
            name: 'pkgpath',
            message: '插件地址(绝对路径)',
            validate: function(pass) {
                return !!pass && endswith(pass, 'mpk') && fs.existsSync(pass);
            }
        }], function(answer) {

                var installPromise = _this.doModou(_this.upload(install_custom_plugin, {
                    name: answer.name,
                    file: function() {
                        return fs.createReadStream(answer.pkgpath);
                    },
                    size: fs.statSync(answer.pkgpath).size
                }));

                installPromise.success(function(resp) {
                    cons();
                    return;
                });

                installPromise.error(function(err) {
                    if (err === 'GEEKDISABLED') {
                        cons('极客模式尚未开启，请先启动魔豆路由上的极客模式');
                        return;
                    }
                    if (err === 'PASSWORDERROR') {
                        cons('尝试登录失败，请重试...');
                        return;
                    }
                    cons(err.msg);
                });
            });
    }
});


module.exports = Task;