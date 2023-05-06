import React, { useRef, useCallback } from 'react';
import { UseFormMethods, FormProvider } from 'react-hook-form';
import { Button, message } from 'antd';

import { YTimePicker, CForm, FormItem, YInput, YSelect, YRangePicker } from '@/components';
import { FormScreen } from '@/types/card';
import { card_temps, StatusOptions } from '@/config/card.config';
import { SCREEN_ID, SCREEN_TITLE, SCREEN_TYPE, SCREEN_STATUS, SCREEN_STRAT, SCREEN_END } from '@/config/card.config';

interface CardScreen {
  form: UseFormMethods<FormScreen>;
  onConfirm: (data: Record<string, any>) => void;
}

const CardScreenForm: React.FC<CardScreen> = ({ form, onConfirm }) => {
  const commitRef = useRef<HTMLInputElement>(null);

  const handleCommitClick = useCallback(() => {
    if (!commitRef.current) {
      return message.error('未找到确认按钮');
    }

    commitRef.current.click();
  }, []);

  return (
    <FormProvider {...form}>
      <h4 className="cardscreen-header">筛选</h4>
      <CForm className="cardscreen-form" submitRef={commitRef} onSubmit={onConfirm}>
        <FormItem form label="卡片ID" name={SCREEN_ID}>
          <YInput />
        </FormItem>

        <FormItem form label="卡片标题" name={SCREEN_TITLE}>
          <YInput />
        </FormItem>

        <FormItem form label="卡片类型" name={SCREEN_TYPE}>
          <YSelect valueName="template_id" labelName="template_name" options={card_temps} />
        </FormItem>

        <FormItem form label="卡片状态" name={SCREEN_STATUS}>
          <YSelect options={StatusOptions} />
        </FormItem>

        <FormItem label="创建时间">
          <div className="formitem-flex">
            <FormItem form name={SCREEN_STRAT}>
              <YTimePicker placeholder="开始时间" />
            </FormItem>
            <span> - </span>
            <FormItem form name={SCREEN_END}>
              <YTimePicker placeholder="结束时间" />
            </FormItem>
          </div>
        </FormItem>

        <section className="cardscreen-footer">
          <Button size="small" type="primary" onClick={handleCommitClick}>
            提 交
          </Button>
        </section>
      </CForm>
    </FormProvider>
  );
};

export default React.memo(CardScreenForm);
