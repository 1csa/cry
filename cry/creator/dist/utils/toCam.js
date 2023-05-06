"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toCam(str) {
    return str.replace(/^[a-z]/, function (s) { return s.toUpperCase(); });
}
exports.default = toCam;
