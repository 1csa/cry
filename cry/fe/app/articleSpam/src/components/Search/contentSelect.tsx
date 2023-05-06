import React, { FC, useEffect, memo } from 'react';
import ENSelect from './enSelect';
import { C_TYPE_OPTION } from '@/config/constant';
interface IContentSelect {
  onChange?: (param: string) => void;
}
const  ContentSelect: FC<IContentSelect> = memo(({onChange}) => {
  useEffect(()=>{
    // console.log('--content--');
  });
  return (
    <ENSelect
      label="文章类型"
      option={C_TYPE_OPTION}
      defaultValue='all'
      onChange={onChange}
    />
  )
});

export default ContentSelect;
