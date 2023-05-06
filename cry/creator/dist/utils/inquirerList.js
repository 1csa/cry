"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputRouteName = exports.inputFileName = exports.baseFileTypes = exports.baseToolsName = void 0;
var baseToolsName = function (choices) { return [
    {
        type: 'list',
        name: 'appName',
        message: '请选择你的工具(appName)',
        choices: choices,
        filter: function (val) { return val.toLowerCase(); },
    },
]; };
exports.baseToolsName = baseToolsName;
var baseFileTypes = [
    {
        type: 'list',
        name: 'ctype',
        message: '请选择需要创建的文件类型',
        choices: [
            {
                name: '创建组件',
                value: 'components',
            },
            {
                name: '创建页面',
                value: 'pages',
            },
        ],
        filter: function (val) { return val.toLowerCase(); },
    },
];
exports.baseFileTypes = baseFileTypes;
var inputFileName = function (type) { return [
    {
        type: 'input',
        message: "\u8BF7\u8F93\u5165\u8981\u521B\u5EFA" + (type === 'pages' ? '页面' : '组件') + "\u7684\u6587\u4EF6\u5939\u6216\u6587\u4EF6\u540D\u79F0\uFF0C\u9ED8\u8BA4\u521B\u5EFAindex.tsx\u6587\u4EF6",
        name: 'filePath',
    },
]; };
exports.inputFileName = inputFileName;
var inputRouteName = [
    {
        type: 'input',
        message: "\u8BF7\u8F93\u5165\u83DC\u5355\u540D\u79F0\uFF0C\u5982\u6709\u4E8C\u7EA7\u83DC\u5355\u8BF7\u7528\u4E2D\u5212\u7EBF(-)\u5206\u5272\uFF0C\u4F8B\uFF1A\u7236-\u5B50",
        name: 'routeName',
        require: true,
    },
];
exports.inputRouteName = inputRouteName;
