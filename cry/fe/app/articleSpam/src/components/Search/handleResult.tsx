import React, { FC, useEffect, memo } from 'react';
import ENSelect from './enSelect';
import { HANDLE_OPTIONS } from '@/config/constant';
interface IHandleResult {
  onChange?: (param: any) => void;
  filter?: string[]; // 2 就是小于2的过滤掉
  mode?: 'multiple' | 'tags';
}
const HandleResult: FC<IHandleResult> = memo(({ onChange, filter, mode }) => {
  useEffect(() => {
    // console.log('--HandleResult--');
  });
  const filterOption = function() {
    const aa = [
      {
        key: 'pass',
        value: '通过',
      },
      {
        key: 'low',
        value: '不通过',
      },
    ];
    // if(filter && filter.length){
    //   return HANDLE_OPTIONS.filter(item => !filter.includes(item.key));
    // }
    return aa;
  };
  return (
    <ENSelect
      label="处理结果"
      option={filterOption()}
      defaultValue={['all']}
      mode={mode}
      onChange={onChange}
    />
  );
});

HandleResult.defaultProps = {
  mode: 'multiple',
};

export default HandleResult;
