/**
 * 投放列表的筛选表单
 */
import React from 'react';
import { FormProvider, UseFormMethods } from 'react-hook-form';

import { YForm, YInput, YSelect, YRangePicker } from '@/components';
import { StatusOptions, SCREEN_ID, SCREEN_APPID } from '@/config/strat.config';
import { SCREEN_NAME, SCREEN_STATUS, SCREEN_CREATE_START, SCREEN_CREATE_END } from '@/config/strat.config';

// TODO: 类型未精细化
interface StratScreen {
  form: UseFormMethods;
  onConfirm: (data: any) => void;
}

const StratScreen: React.FC<StratScreen> = ({ form, onConfirm }) => {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onConfirm)}>
        <h4>筛选</h4>
        <YForm control={form.control}>
          <YInput type="form" name={SCREEN_ID} label="策略ID" />
          <YInput type="form" name={SCREEN_APPID} label="APPID" />
          <YInput type="form" name={SCREEN_NAME} label="策略名称" />
          <YSelect type="form" name={SCREEN_STATUS} label="策略状态" options={StatusOptions} allowClear />
          <YRangePicker type="form" startTime={SCREEN_CREATE_START} endTime={SCREEN_CREATE_END} label="创建时间" />
        </YForm>
        <input className="submit" type="submit" />
      </form>
    </FormProvider>
  );
};

export default React.memo(StratScreen);
