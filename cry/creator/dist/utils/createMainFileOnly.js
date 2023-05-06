"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var createFile_1 = __importDefault(require("./createFile"));
var toCam_1 = __importDefault(require("./toCam"));
var template_1 = __importDefault(require("../template"));
/**
 * 创建单文件
 * @param pathname 文件路径
 * @param exportFileName 具体创建的导出的文件内容的名称 或者说是 componentsName/pagesName
 */
function createMainFileOnly(pathname, exportFileName, fileName) {
    if (fileName === void 0) { fileName = 'index'; }
    createFile_1.default(pathname + "/" + fileName + ".tsx", template_1.default(toCam_1.default(exportFileName)));
    createFile_1.default(pathname + "/index.less");
}
exports.default = createMainFileOnly;
