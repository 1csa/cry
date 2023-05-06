"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var chalk_1 = __importDefault(require("chalk"));
function createMainFile(pathname, template) {
    if (template === void 0) { template = ''; }
    // 同步异步无所谓 无先后依赖
    fs_1.default.writeFile(pathname, template, function (err) {
        if (err)
            throw err;
        console.log(chalk_1.default.green("\u521B\u5EFA " + pathname + " \u6587\u4EF6\u6210\u529F\uFF5E\uFF01"));
    });
}
exports.default = createMainFile;
