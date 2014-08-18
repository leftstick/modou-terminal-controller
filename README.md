modou-terminal-controller
=========================
[![NPM version][npm-image]][npm-url]
![][david-url]
![][travis-url]
> 基于`Nodejs` 开发，所以需要具备一定的`Nodejs` 常识


魔豆wifi终端命令行控制器


![](https://raw.githubusercontent.com/leftstick/modou-terminal-controller/master/docs/img/modou.png)

![](https://raw.githubusercontent.com/leftstick/modou-terminal-controller/master/docs/img/listplugins.png)

## 预备知识 ##

- [nodejs](http://www.nodejs.org/)
- [terminal-task-runner](https://github.com/leftstick/task-runner)

## 安装 ##

```Shell
npm install modou-terminal-controller -g
```

## 使用方法 ##

打开电脑上的命令行工具， Mac、Linux上的`terminal`, window上的`cmd`或者`Git Bash`(推荐)

键入如下命令：

```Shell
modou
```
即可打开一个终端命令行界面，你可以通过上下键选择，按`回车`键执行该任务，就能看到结果了。如果该任务需要鉴权或者其他信息，命令行会要求你输入的，放心


## 控制器-功能列表 ##

- 显示魔豆上已安装的插件
- 安装非认证的插件
- 删除魔豆上已安装的插件
- 启用插件(只有已经停用的插件会显示在这里供启用)
- 停用插件(只有已经启用的插件会显示在这里供停用)
- [设置](./docs/preference.md)
- 恢复默认设置


## LICENSE ##

[MIT License](https://raw.githubusercontent.com/leftstick/modou-terminal-controller/master/LICENSE)


[npm-url]: https://npmjs.org/package/modou-terminal-controller
[npm-image]: https://badge.fury.io/js/modou-terminal-controller.png
[david-url]:https://david-dm.org/leftstick/modou-terminal-controller.png
[travis-url]:https://api.travis-ci.org/leftstick/modou-terminal-controller.svg?branch=master