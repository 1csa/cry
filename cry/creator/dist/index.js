"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = __importDefault(require("commander"));
var stepStart_1 = __importDefault(require("./utils/stepStart"));
exports.default = (function () {
    commander_1.default.command('init').description('初始化选择！');
    commander_1.default.parse(process.argv);
    stepStart_1.default();
});
