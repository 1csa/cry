"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getMockFile = function (apiName) { return "\nexport default {\n  'GET /api/" + apiName + "': {}\n}\n"; };
exports.default = getMockFile;
