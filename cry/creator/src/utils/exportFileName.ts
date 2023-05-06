import toCam from './toCam';
export default function exportFileName(filePath: string) {
  const defaulrFileType = '.tsx';
  const pathArr = filePath.split('/');
  const finillyPath = pathArr[pathArr.length - 1];
  if (filePath.includes(defaulrFileType)) {
    return toCam(finillyPath.replace(defaulrFileType, ''));
  } else {
    return toCam(finillyPath);
  }
}
