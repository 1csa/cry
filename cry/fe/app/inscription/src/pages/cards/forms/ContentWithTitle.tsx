import React from 'react';
import { Divider } from 'antd';
import { UseFormMethods } from 'react-hook-form';

import { FormItem, YInput, YUpload, YSelect } from '@/components';
import { FORM_TITLE, FORM_LEFT_ICON, FORM_MAIN, FORM_CSS, cardCssList } from '@/config/card.config';
import { CardForm } from '@/types/card';

interface CardContent {
  name: string;
  form: UseFormMethods<CardForm>;
}

const CardContent: React.FC<CardContent> = ({ name, form }) => {
  const handleTitleChange = (value: string) => {
    form.setValue(FORM_TITLE, value);
  };
  return (
    <>
      <h4>内容配置</h4>
      {/* <FormItem form name={`${name}.${FORM_TITLE}`} label="卡片标题"> */}
      <FormItem form name={`${name}.${FORM_CSS}`} label="卡片样式">
        <YSelect options={cardCssList} />
      </FormItem>
      <FormItem form name={`${name}.${FORM_MAIN}`} label="卡片标题">
        <YInput onExtraChange={handleTitleChange} />
      </FormItem>
      <FormItem form name={`${name}.${FORM_LEFT_ICON}`} label="顶部ICON">
        <YUpload />
      </FormItem>
      <Divider />
    </>
  );
};

export default React.memo(CardContent);
