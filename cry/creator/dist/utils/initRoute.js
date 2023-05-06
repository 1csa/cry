"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var chalk_1 = __importDefault(require("chalk"));
// 先将单引号转为双引号，再去匹配:分割前边的任意字符，就是会匹配到key:，再通过函数包装
// 接下来删除注释的东西，去掉空格多余的逗号是为了转为json
var stringToJson = function (str) {
    return str
        .replace(/\'/g, '"')
        .replace(/\w.+(?=:)/g, function (s) { return "\"" + s + "\""; })
        .replace(/\/\/.*/g, '')
        .replace(/\s/g, '')
        .replace(/,},/g, '},')
        .replace(/,]/g, ']');
};
var jsonToString = function (str) {
    return str
        .toString()
        .replace(/.+(?=:)/g, function (s) { return s.replace(/"/g, ''); })
        .replace(/"/g, "'");
};
var initNewRoute = function (parentFileName, allRoutePath, menuList, routeName) {
    // - 只有一个菜单的时候，要扩展为多级菜单，需要在原来的路由下增加一个 subMenu 字段，将原来目录下的文件给移动到一个默认的里，再增加一个新的目录放新创建的
    // - 判断目前有没有菜单，有父级目录的话，只需要往 subMenu 追加
    // - 当前所创建的目录没有，则直接创建 创建的话就分为有没有子目录，有子目录的话就需要创建带 subMenu 的 否则创建只有一个菜单的
    if (routeName === void 0) { routeName = ''; }
    var parentPath = "/" + parentFileName; // 父路径 为了判断是否已经存在，需要新增还是更新
    var routeFilePath = "/" + allRoutePath; // 最终创建的文件的路径
    var isExist = menuList.find(function (item) { return item.key === parentPath; });
    var _a = routeName.replace(/\s/g, '').split('-'), fName = _a[0], cName = _a[1];
    if (isExist) {
        // 已存在，在基础上增加
        menuList.forEach(function (ele) {
            if (ele.key === parentPath) {
                var newRouteItem = {
                    key: routeFilePath,
                    icon: 'icondashuju',
                    name: cName,
                };
                ele.subMenu
                    ? ele.subMenu.push(newRouteItem)
                    : (ele.subMenu = [newRouteItem]);
            }
        });
    }
    else {
        // 是一个有子菜单的路由，创建的时候要增加 subMenu
        // 如果创建的文件中没有路径分割，则代表没有submenu
        if (allRoutePath.includes('/')) {
            menuList.push({
                key: parentPath,
                icon: 'iconzhexiantu1',
                name: fName,
                subMenu: [
                    {
                        key: routeFilePath,
                        icon: 'iconhome',
                        name: cName,
                    },
                ],
            });
        }
        else {
            // 不是 就直接创建一个简单的路由
            menuList.push({
                key: parentPath,
                icon: 'iconhome',
                name: fName,
            });
        }
    }
    return menuList;
};
function addRoute(routePath, parentFileName, allRoutePath, routeName) {
    if (parentFileName === void 0) { parentFileName = ''; }
    if (allRoutePath === void 0) { allRoutePath = ''; }
    try {
        // 先设置路径去读配置
        // const routePath = path.join(__dirname, '../src/config/app.config.ts');
        var code = fs_1.default.readFileSync(routePath, 'utf8');
        // console.log('routePath', routePath);
        // console.log('parentFileName', parentFileName);
        // console.log('allRoutePath', allRoutePath);
        if (code.includes('menus')) {
            // 稍微切割一下，将menus后面的字符串获取
            var _a = code.split('menus:'), firstStr = _a[0], menus = _a[1];
            var newStr = menus.slice(0, menus.lastIndexOf(']'));
            // 利用正则转json
            var menusString = stringToJson(newStr + "]");
            // 处理路由逻辑，格式化json最后再将数据还原 指的是引号什么的
            var endRoute = "menus: " + jsonToString(JSON.stringify(initNewRoute(parentFileName, allRoutePath, JSON.parse("" + menusString), routeName), null, 2));
            // console.log('endRoute', endRoute);
            // 和最后剩下的字符拼接 还原文件
            var compos = firstStr +
                endRoute +
                menus.slice(menus.lastIndexOf(']') + 1, menus.length);
            try {
                fs_1.default.writeFileSync(routePath, compos);
                console.log(chalk_1.default.green('更新路由成功！'));
            }
            catch (err) {
                console.error(err);
                process.exit();
            }
        }
        else {
            console.log(chalk_1.default.yellow('您的项目结构暂时不支持自动写入路由！'));
            process.exit();
        }
    }
    catch (err) {
        console.error(err);
        process.exit();
    }
}
exports.default = addRoute;
