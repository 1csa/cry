import React, { FC, useEffect, memo } from 'react';
import ENSelect from './enSelect';
import CategoryList from '@/data/category_list';
interface IArticleSelect {
  onChange?: (param: string) => void;
}
const  ArticleSelect: FC<IArticleSelect> = memo(({onChange}) => {
  useEffect(()=>{
    // console.log('--article--');
  });
  return (
    <ENSelect
      label="文章大类"
      option={CategoryList}
      defaultValue='all'
      onChange={onChange}
    />
  )
});

export default ArticleSelect;
