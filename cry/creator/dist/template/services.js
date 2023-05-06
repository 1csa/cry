"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var servicesFileContent = function (apiName, reqFnName) { return "\nimport request from '@/utils/request';\nimport appConfig from '@/config/app.config';\n\nexport async function fetch" + reqFnName + "(): Promise<any> {\n  return request('/api/" + apiName + "');\n}\n"; };
exports.default = servicesFileContent;
