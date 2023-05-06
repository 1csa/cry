import React from 'react';
import { useWatch } from 'react-hook-form';

import { YRadio, YInput, FormItem, YSelect } from '@/components';

import { YesNoOptions, cardCssList, FORM_BLANK, FORM_NEED, FORM_PATH, FORM_CSS } from '@/config/card.config';

interface CardContentProps {
  name: string;
}

const CardContent: React.FC<CardContentProps> = ({ name }) => {
  const need = useWatch({ name: `${name}.${FORM_NEED}` });

  return (
    <>
      <h4>空白卡配置</h4>
      <FormItem form name={`${name}[${FORM_BLANK}]`} style={{ display: 'none' }} defaultValue={true}>
        <YRadio options={YesNoOptions} />
      </FormItem>
      <FormItem form name={`${name}[${FORM_CSS}]`} label="卡片样式">
        <YSelect options={cardCssList} />
      </FormItem>
      <FormItem form name={`${name}[${FORM_NEED}]`} label="额外获取数据">
        <YRadio options={YesNoOptions} />
      </FormItem>
      <FormItem form name={`${name}[${FORM_PATH}]`} label="获取数据路径">
        <YInput />
      </FormItem>
      {need ? 'hello' : null}
    </>
  );
};

export default React.memo(CardContent);
