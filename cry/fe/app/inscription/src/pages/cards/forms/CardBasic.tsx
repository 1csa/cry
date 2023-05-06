/**
 * 投放的基础信息
 */
import React, { useCallback } from 'react';
import { UseFormMethods } from 'react-hook-form';

import { YTextarea, YSelect, YInput, FormItem } from '@/components';
import { isEmpty } from "@/utils";

import { card_temps, defaultCards } from '@/config/card.config';
import { FORM_TEMP, FORM_REMARK, FORM_ID, FORM_TITLE } from '@/config/card.config';
import { CardForm } from '@/types/card';

interface CardBasic {
  form: UseFormMethods<CardForm>;
}

const CardBasic: React.FC<CardBasic> = ({ form }) => {
  const temp = form.watch(FORM_TEMP);

  const handleTempChange = useCallback((value: any) => {
    form.reset({ ...defaultCards, [FORM_TEMP]: value });
  }, []);

  return (
    <>
      <h4>基础配置</h4>
      <FormItem
        form={true}
        label="卡片类型"
        name={FORM_TEMP}
        rule={{ required: { value: true, message: '卡片类型为必填' } }}
      >
        <YSelect
          options={card_temps}
          labelName="template_name"
          valueName="template_id"
          onExtraChange={handleTempChange}
        >
          {isEmpty(isEmpty) === false && temp !== 1003 ? ( // 三级卡片的时候 不展示图片
            <img
              src={card_temps.find(item => item.template_id === temp)?.preview}
              style={{ width: '100%', margin: '4px 0' }}
            />
          ) : (
            undefined
          )}
        </YSelect>
      </FormItem>

      <FormItem form={true} label="卡片ID" name={FORM_ID}>
        <YInput disabled={true} placeholder="自动生成" />
      </FormItem>

      <FormItem form label="卡片标题" name={FORM_TITLE} style={{ display: 'none' }}>
        <YInput placeholder="必填，为内部统计标题" />
      </FormItem>

      <FormItem form={true} label="卡片说明" name={FORM_REMARK}>
        <YTextarea placeholder="选填，仅供内部复盘查看" />
      </FormItem>
    </>
  );
};

export default React.memo(CardBasic);
