import React, { FC, useEffect, memo } from 'react';
import ENSelect from './enSelect';
import { SCORE_OPTIONS } from '@/config/constant';
interface IHandleScore {
  onChange?: (param: any) => void;
  filter?: string[]; // 2 就是小于2的过滤掉
}
const HandleScore: FC<IHandleScore> = memo(({ onChange, filter }) => {
  useEffect(() => {
    // console.log('--HandleScore--');
  });
  const filterOption = function() {
    if (filter && filter.length) {
      return SCORE_OPTIONS.filter(item => !filter.includes(item.key.toString()));
    }
    return [
      {
        key: 5,
        value: 5,
      },
      {
        key: 4,
        value: 4,
      },
      {
        key: 3,
        value: 3,
      },
      {
        key: 2,
        value: 2,
      },
      {
        key: 1,
        value: 1,
      },
      {
        key: 0,
        value: 0,
      },
    ].reverse();
  };
  return (
    <ENSelect
      label="评分"
      option={filterOption()}
      defaultValue={['all']}
      mode="multiple"
      onChange={onChange}
    />
  );
});

export default HandleScore;
