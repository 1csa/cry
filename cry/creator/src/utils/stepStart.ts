import inquirer from 'inquirer';
import toolsNameMap from './toolsNameMap';
import {
  baseToolsName,
  baseFileTypes,
  inputFileName,
  inputRouteName,
} from './inquirerList';
import path from 'path';
import creator from './creator';

async function handleCreateCommand(appName: { [K: string]: string }) {
  if (appName.appName === 'exit') {
    process.exit();
  }
  const ctypeAns = await inquirer.prompt(baseFileTypes);

  // 获取需要创建的文件夹的名称
  const fileNameAns = await inquirer.prompt(inputFileName(ctypeAns.ctype));

  let routeNameAns = {};
  if (ctypeAns.ctype === 'pages') {
    routeNameAns = await inquirer.prompt(inputRouteName);
  }

  // 将文件类型和工具app名称对象数据合并
  const selecterInfo = Object.assign(
    {},
    ctypeAns,
    appName,
    fileNameAns,
    routeNameAns,
  );

  creator(selecterInfo);
  // console.log(
  //   'createFileTypeAns',
  //   ctypeAns,
  //   appName,
  //   Object.assign({}, ctypeAns, appName),
  // );
}

async function stepStart() {
  const appNameAns = await inquirer.prompt(baseToolsName(toolsNameMap()));
  handleCreateCommand(appNameAns);
}

export default stepStart;
