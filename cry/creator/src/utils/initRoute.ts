import fs from 'fs';
import { MenuType } from '../type';
import chalk from 'chalk';

// 先将单引号转为双引号，再去匹配:分割前边的任意字符，就是会匹配到key:，再通过函数包装
// 接下来删除注释的东西，去掉空格多余的逗号是为了转为json
const stringToJson = (str: string) =>
  str
    .replace(/\'/g, '"')
    .replace(/\w.+(?=:)/g, (s) => `"${s}"`)
    .replace(/\/\/.*/g, '')
    .replace(/\s/g, '')
    .replace(/,},/g, '},')
    .replace(/,]/g, ']');

const jsonToString = (str: string) =>
  str
    .toString()
    .replace(/.+(?=:)/g, (s) => s.replace(/"/g, ''))
    .replace(/"/g, `'`);

const initNewRoute = (
  parentFileName: string,
  allRoutePath: string,
  menuList: MenuType[],
  routeName: string = '',
) => {
  // - 只有一个菜单的时候，要扩展为多级菜单，需要在原来的路由下增加一个 subMenu 字段，将原来目录下的文件给移动到一个默认的里，再增加一个新的目录放新创建的
  // - 判断目前有没有菜单，有父级目录的话，只需要往 subMenu 追加
  // - 当前所创建的目录没有，则直接创建 创建的话就分为有没有子目录，有子目录的话就需要创建带 subMenu 的 否则创建只有一个菜单的

  const parentPath = `/${parentFileName}`; // 父路径 为了判断是否已经存在，需要新增还是更新
  const routeFilePath = `/${allRoutePath}`; // 最终创建的文件的路径

  const isExist = menuList.find((item) => item.key === parentPath);

  const [fName, cName] = routeName.replace(/\s/g, '').split('-');

  if (isExist) {
    // 已存在，在基础上增加
    menuList.forEach((ele) => {
      if (ele.key === parentPath) {
        const newRouteItem = {
          key: routeFilePath,
          icon: 'icondashuju',
          name: cName,
        };
        ele.subMenu
          ? ele.subMenu.push(newRouteItem)
          : (ele.subMenu = [newRouteItem]);
      }
    });
  } else {
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
    } else {
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

function addRoute(
  routePath: string,
  parentFileName: string = '',
  allRoutePath: string = '',
  routeName: string,
) {
  try {
    // 先设置路径去读配置
    // const routePath = path.join(__dirname, '../src/config/app.config.ts');
    const code = fs.readFileSync(routePath, 'utf8');
    // console.log('routePath', routePath);
    // console.log('parentFileName', parentFileName);
    // console.log('allRoutePath', allRoutePath);

    if (code.includes('menus')) {
      // 稍微切割一下，将menus后面的字符串获取
      const [firstStr, menus] = code.split('menus:');
      const newStr = menus.slice(0, menus.lastIndexOf(']'));

      // 利用正则转json
      const menusString = stringToJson(`${newStr}]`);

      // 处理路由逻辑，格式化json最后再将数据还原 指的是引号什么的
      const endRoute = `menus: ${jsonToString(
        JSON.stringify(
          initNewRoute(
            parentFileName,
            allRoutePath,
            JSON.parse(`${menusString}`),
            routeName,
          ),
          null,
          2,
        ),
      )}`;
      // console.log('endRoute', endRoute);

      // 和最后剩下的字符拼接 还原文件
      const compos =
        firstStr +
        endRoute +
        menus.slice(menus.lastIndexOf(']') + 1, menus.length);
      try {
        fs.writeFileSync(routePath, compos);
        console.log(chalk.green('更新路由成功！'));
      } catch (err) {
        console.error(err);
        process.exit();
      }
    } else {
      console.log(chalk.yellow('您的项目结构暂时不支持自动写入路由！'));
      process.exit();
    }
  } catch (err) {
    console.error(err);
    process.exit();
  }
}

export default addRoute;
