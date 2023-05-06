"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var getOldFileContent_1 = __importDefault(require("./getOldFileContent"));
var fs_1 = __importDefault(require("fs"));
var isPathExist_1 = __importDefault(require("./isPathExist"));
var createFile_1 = __importDefault(require("./createFile"));
var mock_1 = __importDefault(require("../template/mock"));
var chalk_1 = __importDefault(require("chalk"));
var generator_1 = __importDefault(require("@babel/generator"));
var parser_1 = require("@babel/parser");
/**
 * mock 文件是创建的父文件
 * @param parentPath
 * @param childFielName
 */
function updateMockFile(parentPath, childFielName) {
    if (!isPathExist_1.default(parentPath)) {
        createFile_1.default(parentPath, mock_1.default(childFielName));
    }
    else {
        var newCode = getOldFileContent_1.default(parentPath).replace('export default {', function () {
            return "export default {\n        'GET /api/" + (childFielName || parentPath) + "': {},";
        });
        var ast = parser_1.parse(newCode, {
            sourceType: 'module', // 解析的是ES模块
        });
        var code = generator_1.default(ast, {
            retainLines: false,
            compact: 'auto',
            concise: false,
        }, newCode).code;
        try {
            fs_1.default.writeFileSync(parentPath, code);
            console.log(chalk_1.default.green("\u66F4\u65B0: " + parentPath + " \u6587\u4EF6\u6210\u529F\uFF01"));
        }
        catch (error) {
            console.log(chalk_1.default.red("\u66F4\u65B0: " + parentPath + " \u6587\u4EF6\u5931\u8D25\uFF01"));
        }
    }
}
exports.default = updateMockFile;
