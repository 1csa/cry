/**
 * record处理，去掉所有数据中的undefined和undefined
*/

import { isNull } from '@/utils';

const parseRecord = <T extends Record<string, unknown>>(record: T): T => {
  const jsonStr = JSON.stringify(record, (_, value) => {
    if (isNull(value)) {
      return undefined;
    }
    return value
  })

  return JSON.parse(jsonStr);
};

export default parseRecord;
