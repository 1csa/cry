import getOldFileContent from './getOldFileContent';
import fs from 'fs';
import isPathExist from './isPathExist';
import createFile from './createFile';
import services from '../template/services';
import toCam from './toCam';
import chalk from 'chalk';

export default function updateServiceFile(
  parentPath: string,
  childFielName: string,
) {
  console.log('isPathExist(parentPath)', isPathExist(parentPath));
  if (!isPathExist(parentPath)) {
    createFile(parentPath, services(childFielName, toCam(childFielName)));
  } else {
    const oldCode = getOldFileContent(parentPath);
    console.log('oldCode', oldCode);

    const newCode = `${oldCode}
export async function fetch${toCam(childFielName)}(): Promise<any> {
  return request('/api/${childFielName || parentPath}');
}`;
    try {
      fs.writeFileSync(parentPath, newCode);
      console.log(chalk.green(`更新: ${parentPath} 文件成功！`));
    } catch (error) {
      console.log(chalk.red(`更新: ${parentPath} 文件失败！`));
    }
  }
}
