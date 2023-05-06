// 字母和数字算半个字符
export default function(str: string = '') {
  const semiChar = str.match(/[0-9A-Za-z\s]/g);
  const semiLength = semiChar ? semiChar.length : 0;
  const strLength = str.length;

  return strLength - Math.floor(semiLength / 2);
}
