"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
function pathType(path) {
    try {
        var stat = fs_1.default.lstatSync(path);
        if (stat.isDirectory()) {
            return 'isDirectory';
        }
        else if (stat.isFile()) {
            return 'isFile';
        }
    }
    catch (error) {
        return '';
    }
}
exports.default = pathType;
