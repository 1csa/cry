import getOldFileContent from './getOldFileContent';
import fs from 'fs';
import isPathExist from './isPathExist';
import createFile from './createFile';
import mock from '../template/mock';
import chalk from 'chalk';
import generate from '@babel/generator';
import { parse } from '@babel/parser';
import t from '@babel/types';

/**
 * mock 文件是创建的父文件
 * @param parentPath
 * @param childFielName
 */

export default function updateMockFile(
  parentPath: string,
  childFielName: string,
) {
  if (!isPathExist(parentPath)) {
    createFile(parentPath, mock(childFielName));
  } else {
    const newCode = getOldFileContent(parentPath).replace(
      'export default {',
      () => {
        return `export default {
        'GET /api/${childFielName || parentPath}': {},`;
      },
    );
    const ast = parse(newCode, {
      sourceType: 'module', // 解析的是ES模块
    });

    const { code } = generate(
      ast,
      {
        retainLines: false,
        compact: 'auto',
        concise: false,
      },
      newCode,
    );

    try {
      fs.writeFileSync(parentPath, code);
      console.log(chalk.green(`更新: ${parentPath} 文件成功！`));
    } catch (error) {
      console.log(chalk.red(`更新: ${parentPath} 文件失败！`));
    }
  }
}
