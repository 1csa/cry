"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var toCam_1 = __importDefault(require("./toCam"));
function exportFileName(filePath) {
    var defaulrFileType = '.tsx';
    var pathArr = filePath.split('/');
    var finillyPath = pathArr[pathArr.length - 1];
    if (filePath.includes(defaulrFileType)) {
        return toCam_1.default(finillyPath.replace(defaulrFileType, ''));
    }
    else {
        return toCam_1.default(finillyPath);
    }
}
exports.default = exportFileName;
