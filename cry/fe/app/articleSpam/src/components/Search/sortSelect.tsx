import React, { FC, useEffect, memo } from 'react';
import ENSelect from './enSelect';
import { SORT_OPTION } from '@/config/constant';
interface ISortSelectProps {
  onChange?: (param: string) => void;
  filter?: string[]; // 2 就是小于2的过滤掉
}
const  SortSelect: FC<ISortSelectProps> = memo(({onChange, filter}) => {
  useEffect(()=>{
    // console.log('--sort--');
  });
  const filterOption = function(){
    if(filter && filter.length){
      return SORT_OPTION.filter(item => !filter.includes(item.key));
    }
    return SORT_OPTION;
  }
  return (
    <ENSelect
      label="排序"
      option={filterOption()}
      defaultValue='all'
      onChange={onChange}
    />
  )
});

export default SortSelect;
