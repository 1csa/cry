/**
 * newRecord merge，将defaultvalue和给定的value进行合并，只针对同层级嵌套的数据结构
*/
import { isObject, isArray, isUndefined, isNull } from '@/utils';

export const reparseCard = <T = Record<string, any>>(record: T, defaultRecord: T): T => {
  const newRecord = JSON.parse(JSON.stringify(record));
  const recordEntries = Object.entries(defaultRecord);

  for (let [key, value] of recordEntries) {
    const target = newRecord[key];

    if (isObject(target)) {
      newRecord[key] = reparseCard(newRecord[key], defaultRecord[key]);
    }

    if (isArray(target)) {
      newRecord[key] = target.map(item => item ? reparseCard(item, defaultRecord) : item);
    }

    if (isUndefined(target)) {
      newRecord[key] = defaultRecord[key] === null ? null : defaultRecord[key];
    }
  }

  return newRecord;
}

// 对数组的处理不太合适，需要再验证
export const reparseRecord = <T = Record<string, any>>(record: T, defaultRecord: T): T => {
  const newRecord = JSON.parse(JSON.stringify(record));
  const recordEntries = Object.entries(defaultRecord);

  for (let [key] of recordEntries) {
    const target = newRecord[key];

    if (isObject(target)) {
      newRecord[key] = reparseRecord(newRecord[key], defaultRecord[key]);
    }

    if (isArray(target)) {
      newRecord[key] = target.map(item => item ? reparseRecord(item, defaultRecord) : item);
    }

    if (isUndefined(target)) {
      newRecord[key] = defaultRecord[key] || null;
    }
  }

  return newRecord;
}
