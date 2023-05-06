"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var getOldFileContent_1 = __importDefault(require("./getOldFileContent"));
var fs_1 = __importDefault(require("fs"));
var isPathExist_1 = __importDefault(require("./isPathExist"));
var createFile_1 = __importDefault(require("./createFile"));
var services_1 = __importDefault(require("../template/services"));
var toCam_1 = __importDefault(require("./toCam"));
var chalk_1 = __importDefault(require("chalk"));
function updateServiceFile(parentPath, childFielName) {
    console.log('isPathExist(parentPath)', isPathExist_1.default(parentPath));
    if (!isPathExist_1.default(parentPath)) {
        createFile_1.default(parentPath, services_1.default(childFielName, toCam_1.default(childFielName)));
    }
    else {
        var oldCode = getOldFileContent_1.default(parentPath);
        console.log('oldCode', oldCode);
        var newCode = oldCode + "\nexport async function fetch" + toCam_1.default(childFielName) + "(): Promise<any> {\n  return request('/api/" + (childFielName || parentPath) + "');\n}";
        try {
            fs_1.default.writeFileSync(parentPath, newCode);
            console.log(chalk_1.default.green("\u66F4\u65B0: " + parentPath + " \u6587\u4EF6\u6210\u529F\uFF01"));
        }
        catch (error) {
            console.log(chalk_1.default.red("\u66F4\u65B0: " + parentPath + " \u6587\u4EF6\u5931\u8D25\uFF01"));
        }
    }
}
exports.default = updateServiceFile;
