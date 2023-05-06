import fs from 'fs';
import chalk from 'chalk';
import path from 'path';
import { ChoicesTypes } from '../type';

const toolsMap = () => {
  try {
    const toolPath = path.resolve(__dirname, `../../../fe/app/`);
    const toolsList = fs.readdirSync(toolPath);
    const baseToolsList: ChoicesTypes[] = toolsList
      .filter((item: string) => !item.startsWith('.'))
      .map((item: string) => {
        return {
          name: item,
          value: item,
        };
      });

    return [
      ...baseToolsList,
      {
        name: '退出',
        value: 'exit',
      },
    ];
  } catch (error) {
    console.log(chalk.red('文件读取失败！'));
    process.exit();
  }
};

export default toolsMap;
