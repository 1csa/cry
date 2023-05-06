/**
 * 判定输入是否可以为字符串数值
*/

export default (value: unknown): boolean => {
  // value === null为特殊情况，即统一使用null值作为默认值
  if (value === null) {
    return true;
  }

  if (typeof value === 'number' && Number.isNaN(value) === false) {
    return true;
  }

  if (typeof value === 'string') {
    return Number.isNaN(+value) === false;
  }

  return false
}
