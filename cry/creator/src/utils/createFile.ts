import fs from 'fs';
import chalk from 'chalk';
export default function createMainFile(
  pathname: string,
  template: string = '',
) {
  // 同步异步无所谓 无先后依赖
  fs.writeFile(pathname, template, (err) => {
    if (err) throw err;
    console.log(chalk.green(`创建 ${pathname} 文件成功～！`));
  });
}
