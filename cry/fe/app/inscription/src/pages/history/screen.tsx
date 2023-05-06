/**
 * 历史列表的筛选表单
 * 改了一下prd: 选择类型为卡片管理时额外提供，另外添加了
 */
import React, { useRef } from 'react';
import { FormProvider, UseFormMethods } from 'react-hook-form';
import { Button, message } from 'antd';

import { CForm, FormItem, YInput, YSelect, YRangePicker } from '@/components';
import { HistoryScreen } from '@/types/other';
import {
  targetOptions,
  typeOptions,
  SCREEN_TARGET,
  SCREEN_TYPE,
  SCREEN_OPERATOR,
  SCREEN_START,
  SCREEN_END,
} from '@/config/history.config';

interface HistoryScreenType {
  form: UseFormMethods;
  onConfirm: (data: Record<string, any>) => void;
}

export const HistoryScreenForm: React.FC<HistoryScreenType> = React.memo(({ form, onConfirm }) => {
  const commitRef = useRef<HTMLInputElement>(null);

  const handleConfirmClick = () => {
    if (!commitRef.current) {
      return message.error("未找到确认按钮")
    }
    commitRef.current.click();
  };

  return (
    <FormProvider {...form}>
      <h4>筛选</h4>
      <CForm submitRef={commitRef} onSubmit={onConfirm}>
        <FormItem form name={SCREEN_TARGET} label="操作对象">
          <YSelect options={targetOptions} />
        </FormItem>
        <FormItem form name={SCREEN_TYPE} label="操作类型">
          <YSelect options={typeOptions} />
        </FormItem>
        <FormItem form name={SCREEN_OPERATOR} label="操作人">
          <YInput />
        </FormItem>
        <FormItem form label="操作时间">
          <YRangePicker startTime={SCREEN_START} endTime={SCREEN_END} />
        </FormItem>
      </CForm>
      <Button size="small" type="primary" onClick={handleConfirmClick}>确认</Button>
    </FormProvider>
  );
});
