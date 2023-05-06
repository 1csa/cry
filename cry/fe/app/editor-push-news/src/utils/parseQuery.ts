/**
 * 将请求接口拼接成字符串，去掉object、undefined、null、''、NaN等无效值
*/

import { isObject, isString, isNumber, isUndefined, isNull } from '@/utils';

export default function (record: Record<string, unknown>): string {
  const recordEntries = Object.entries(record).filter(([_, value]) => {
    if (isObject(value) || isUndefined(value) || isNull(value)) {
      return false;
    }

    if (isNumber(value) && Number.isNaN(value)) {
      return false
    }

    if (isString(value) && value.length === 0) {
      return false
    }

    return true
  });

  return recordEntries.map(item => item.join('=')).join('&');
}
