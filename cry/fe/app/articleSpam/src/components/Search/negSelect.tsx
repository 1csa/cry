import React, { FC, useEffect, memo } from 'react';
import ENSelect from './enSelect';
// 负向理由
interface INegSelect {
  onChange?: (param: any) => void;
  filter?: string[]; // 2 就是小于2的过滤掉
  options: Array<string>
}
const  NegSelect: FC<INegSelect> = memo(({onChange, filter, options}) => {
  useEffect(()=>{
    // console.log('--NegSelect--');
  });
  const filterOption = function(){
    if(filter && filter.length){
      return options.filter(item => !filter.includes(item.toString()));
    }
    return options;
  }
  return (
    <ENSelect
      label="负向理由"
      option={filterOption()}
      defaultValue={['all']}
      mode="multiple"
      onChange={onChange}
    />
  )
});
export default NegSelect;
