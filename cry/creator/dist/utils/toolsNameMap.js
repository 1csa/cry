"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var chalk_1 = __importDefault(require("chalk"));
var path_1 = __importDefault(require("path"));
var toolsMap = function () {
    try {
        var toolPath = path_1.default.resolve(__dirname, "../../../fe/app/");
        var toolsList = fs_1.default.readdirSync(toolPath);
        var baseToolsList = toolsList
            .filter(function (item) { return !item.startsWith('.'); })
            .map(function (item) {
            return {
                name: item,
                value: item,
            };
        });
        return __spreadArray(__spreadArray([], baseToolsList), [
            {
                name: '退出',
                value: 'exit',
            },
        ]);
    }
    catch (error) {
        console.log(chalk_1.default.red('文件读取失败！'));
        process.exit();
    }
};
exports.default = toolsMap;
