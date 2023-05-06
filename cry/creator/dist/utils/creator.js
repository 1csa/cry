"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var isPathExist_1 = __importDefault(require("./isPathExist"));
var toCam_1 = __importDefault(require("./toCam"));
var createMainFileOnly_1 = __importDefault(require("./createMainFileOnly"));
var mkdirsSync_1 = __importDefault(require("./mkdirsSync"));
var updateMockFile_1 = __importDefault(require("./updateMockFile"));
var updateServicesFile_1 = __importDefault(require("./updateServicesFile"));
var exportFileName_1 = __importDefault(require("./exportFileName"));
var chalk_1 = __importDefault(require("chalk"));
var initRoute_1 = __importDefault(require("./initRoute"));
function creator(selecterInfo) {
    return __awaiter(this, void 0, void 0, function () {
        var baseSrcPath, baseMockPath, baseServicesPath, routePath, joinSrcPath, pagesPath, componentsFilePath, finallyPath, updateMockServicesFile, updateRoute, createFileType, fileExtensionName, _a, parPath, childPath, noExtensionPath, customFileName, finallyDirPath, _b, parPath, childPath;
        return __generator(this, function (_c) {
            baseSrcPath = "../../../fe/app/" + selecterInfo.appName + "/src/" + selecterInfo.ctype;
            baseMockPath = function (filePath) {
                return path_1.default.join(__dirname, "../../../fe/app/" + selecterInfo.appName + "/mock/" + filePath);
            };
            baseServicesPath = function (filePath) {
                return path_1.default.join(__dirname, "../../../fe/app/" + selecterInfo.appName + "/src/services/" + filePath);
            };
            routePath = path_1.default.join(__dirname, "../../../fe/app/" + selecterInfo.appName + "/src/config/app.config.ts");
            joinSrcPath = function (filePath) { return baseSrcPath + "/" + filePath; };
            pagesPath = path_1.default.join(__dirname, joinSrcPath(selecterInfo.filePath));
            componentsFilePath = path_1.default.join(__dirname, joinSrcPath(selecterInfo === null || selecterInfo === void 0 ? void 0 : selecterInfo.filePath.split('/').map(function (item) { return toCam_1.default(item); }).join('/')));
            finallyPath = (selecterInfo === null || selecterInfo === void 0 ? void 0 : selecterInfo.ctype) === 'components' ? componentsFilePath : pagesPath;
            if ((selecterInfo === null || selecterInfo === void 0 ? void 0 : selecterInfo.filePath.split('/').length) >= 3 &&
                !(selecterInfo === null || selecterInfo === void 0 ? void 0 : selecterInfo.filePath.includes('.'))) {
                console.log(chalk_1.default.red('创建的文件夹路径目前不支持3级'));
                process.exit();
            }
            updateMockServicesFile = function (parPath, childPath) {
                updateMockFile_1.default(baseMockPath(parPath) + ".ts", childPath || parPath);
                updateServicesFile_1.default(baseServicesPath(parPath) + ".ts", childPath || parPath);
            };
            updateRoute = function (parPath, filePath) {
                return initRoute_1.default(routePath, parPath, filePath, selecterInfo === null || selecterInfo === void 0 ? void 0 : selecterInfo.routeName);
            };
            // 如果所要创建的目录不存在
            if (!isPathExist_1.default(finallyPath)) {
                createFileType = ['.tsx', '.ts'];
                fileExtensionName = selecterInfo.filePath
                    .substr(selecterInfo.filePath.indexOf('.'))
                    .toLowerCase();
                // 输入的内容是文件夹没有扩展名
                if (!createFileType.includes(fileExtensionName)) {
                    // 组件 只需要创建两个主文件
                    // 先递归创建文件夹，最后在最后一层创建index.tsx文件
                    // 如果创建成功之后 创建新的index.tsx
                    if (mkdirsSync_1.default(finallyPath)) {
                        createMainFileOnly_1.default(finallyPath, exportFileName_1.default(selecterInfo === null || selecterInfo === void 0 ? void 0 : selecterInfo.filePath));
                    }
                    if ((selecterInfo === null || selecterInfo === void 0 ? void 0 : selecterInfo.ctype) === 'pages') {
                        _a = selecterInfo === null || selecterInfo === void 0 ? void 0 : selecterInfo.filePath.split('/'), parPath = _a[0], childPath = _a[1];
                        updateMockServicesFile(parPath, childPath);
                        updateRoute(parPath, selecterInfo === null || selecterInfo === void 0 ? void 0 : selecterInfo.filePath);
                    }
                }
                else {
                    noExtensionPath = finallyPath.replace(fileExtensionName, '');
                    customFileName = noExtensionPath.split('/').slice(-1)[0];
                    finallyDirPath = noExtensionPath.split('/').slice(0, -1).join('/');
                    // 先递归创建文件夹，最后 根据文件扩展名创建对应的文件而不是默认的index.tsx
                    if (mkdirsSync_1.default(finallyDirPath)) {
                        createMainFileOnly_1.default(finallyDirPath, exportFileName_1.default(customFileName), customFileName);
                    }
                    if ((selecterInfo === null || selecterInfo === void 0 ? void 0 : selecterInfo.ctype) === 'pages') {
                        _b = selecterInfo === null || selecterInfo === void 0 ? void 0 : selecterInfo.filePath.replace(fileExtensionName, '').split('/'), parPath = _b[0], childPath = _b[1];
                        updateMockServicesFile(parPath, childPath);
                        // 写入路由
                        updateRoute(parPath, selecterInfo === null || selecterInfo === void 0 ? void 0 : selecterInfo.filePath.replace(fileExtensionName, ''));
                    }
                }
            }
            else {
                console.log('所创建的目录已存在');
                process.exit();
            }
            return [2 /*return*/];
        });
    });
}
exports.default = creator;
