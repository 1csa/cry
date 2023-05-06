import React, { useState } from 'react';

import { YTextarea, YInput, FormItem } from '@/components';
import { FORM_TITLE, FORM_REMARK, FORM_ID } from '@/config/strat.config';

interface StratBasic {}

const StratBasic: React.FC<StratBasic> = ({}) => {
  return (
    <>
      <FormItem form label="策略ID" name={FORM_ID}>
        <YInput defaultValue="" disabled />
      </FormItem>
      <FormItem
        form
        label="策略名称"
        name={FORM_TITLE}
        rule={{ required: { value: true, message: '该字段为必填字段' } }}
      >
        <YInput placeholder="请输入策略名称" />
      </FormItem>
      <FormItem form label="策略说明" name={FORM_REMARK}>
        <YTextarea placeholder="选填，仅做内部复盘查看" />
      </FormItem>
    </>
  );
};

export default React.memo(StratBasic);
