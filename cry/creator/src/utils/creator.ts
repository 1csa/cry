import path from 'path';
import isPathExist from './isPathExist';
import toCam from './toCam';
import createMainFileOnly from './createMainFileOnly';
import mkdirsSync from './mkdirsSync';
import updateMockFile from './updateMockFile';
import updateServiceFile from './updateServicesFile';
import exportFileName from './exportFileName';
import chalk from 'chalk';
import initRoute from './initRoute';

export default async function creator(selecterInfo: { [K: string]: string }) {
  // 基础路径
  const baseSrcPath = `../../../fe/app/${selecterInfo.appName}/src/${selecterInfo.ctype}`;
  const baseMockPath = (filePath: string) =>
    path.join(
      __dirname,
      `../../../fe/app/${selecterInfo.appName}/mock/${filePath}`,
    );
  const baseServicesPath = (filePath: string) =>
    path.join(
      __dirname,
      `../../../fe/app/${selecterInfo.appName}/src/services/${filePath}`,
    );
  const routePath = path.join(
    __dirname,
    `../../../fe/app/${selecterInfo.appName}/src/config/app.config.ts`,
  );
  const joinSrcPath = (filePath: string) => `${baseSrcPath}/${filePath}`;
  // pages路径
  const pagesPath = path.join(__dirname, joinSrcPath(selecterInfo.filePath));
  // 组件路径需要被转为驼峰
  const componentsFilePath: string = path.join(
    __dirname,
    joinSrcPath(
      selecterInfo?.filePath
        .split('/')
        .map((item: string) => toCam(item))
        .join('/'),
    ),
  );

  // 最终需要创建的路径
  const finallyPath =
    selecterInfo?.ctype === 'components' ? componentsFilePath : pagesPath;

  if (
    selecterInfo?.filePath.split('/').length >= 3 &&
    !selecterInfo?.filePath.includes('.')
  ) {
    console.log(chalk.red('创建的文件夹路径目前不支持3级'));
    process.exit();
  }

  const updateMockServicesFile = (parPath: string, childPath: string) => {
    updateMockFile(`${baseMockPath(parPath)}.ts`, childPath || parPath);
    updateServiceFile(`${baseServicesPath(parPath)}.ts`, childPath || parPath);
  };

  const updateRoute = (parPath: string, filePath: string) =>
    initRoute(routePath, parPath, filePath, selecterInfo?.routeName);

  // 如果所要创建的目录不存在
  if (!isPathExist(finallyPath)) {
    const createFileType = ['.tsx', '.ts'];

    // 获取文件扩展名
    const fileExtensionName = selecterInfo.filePath
      .substr(selecterInfo.filePath.indexOf('.'))
      .toLowerCase();

    // 输入的内容是文件夹没有扩展名
    if (!createFileType.includes(fileExtensionName)) {
      // 组件 只需要创建两个主文件
      // 先递归创建文件夹，最后在最后一层创建index.tsx文件
      // 如果创建成功之后 创建新的index.tsx
      if (mkdirsSync(finallyPath)) {
        createMainFileOnly(finallyPath, exportFileName(selecterInfo?.filePath));
      }
      if (selecterInfo?.ctype === 'pages') {
        // 创建的是页面的话，需要先去创建一系列文件夹，以及两个主文件
        // 再去创建或者更新mock/service以及更新路由文件
        const [parPath, childPath] = selecterInfo?.filePath.split('/');
        updateMockServicesFile(parPath, childPath);
        updateRoute(parPath, selecterInfo?.filePath);
      }
    } else {
      // 文件
      // 抹去文件扩展名
      const noExtensionPath = finallyPath.replace(fileExtensionName, '');
      // 用户自己输入的文件名称
      const [customFileName] = noExtensionPath.split('/').slice(-1);
      // 最终要创建的文件夹
      const finallyDirPath = noExtensionPath.split('/').slice(0, -1).join('/');

      // 先递归创建文件夹，最后 根据文件扩展名创建对应的文件而不是默认的index.tsx
      if (mkdirsSync(finallyDirPath)) {
        createMainFileOnly(
          finallyDirPath,
          exportFileName(customFileName),
          customFileName,
        );
      }
      if (selecterInfo?.ctype === 'pages') {
        // 创建的是页面的话，需要先去创建一系列文件夹，以及两个主文件
        // 再去创建或者更新mock/service以及更新路由文件
        const [parPath, childPath] = selecterInfo?.filePath
          .replace(fileExtensionName, '')
          .split('/');

        updateMockServicesFile(parPath, childPath);

        // 写入路由
        updateRoute(
          parPath,
          selecterInfo?.filePath.replace(fileExtensionName, ''),
        );
      }
    }
  } else {
    console.log('所创建的目录已存在');
    process.exit();
  }
}
