import React, { FC, useEffect, memo } from 'react';
import ENSelect from './enSelect';
import { TIER_OPTION } from '@/config/constant';
interface ITierSelect {
  onChange?: (param: string) => void;
  filter?: string[]; // 2 就是小于2的过滤掉
}
const  TierSelect: FC<ITierSelect> = memo(({onChange, filter}) => {
  useEffect(()=>{
    // console.log('--Tier--');
  });
  const filterOption = function(){
    if(filter && filter.length){
      return TIER_OPTION.filter(item => !filter.includes(item.key));
    }
    return TIER_OPTION;
  }
  return (
    <ENSelect
      label="源评级"
      option={filterOption()}
      defaultValue='all'
      onChange={onChange}
    />
  )
});

export default TierSelect;
