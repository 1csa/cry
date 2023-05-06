"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
function getOldFileContent(filePath) {
    var data = fs_1.default.readFileSync(filePath, 'utf8');
    return data;
}
exports.default = getOldFileContent;
