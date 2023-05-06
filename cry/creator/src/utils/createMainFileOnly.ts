import createFile from './createFile';
import toCam from './toCam';
import mainTsx from '../template';
/**
 * 创建单文件
 * @param pathname 文件路径
 * @param exportFileName 具体创建的导出的文件内容的名称 或者说是 componentsName/pagesName
 */
export default function createMainFileOnly(
  pathname: string,
  exportFileName: string,
  fileName: string = 'index',
) {
  createFile(`${pathname}/${fileName}.tsx`, mainTsx(toCam(exportFileName)));
  createFile(`${pathname}/index.less`);
}
