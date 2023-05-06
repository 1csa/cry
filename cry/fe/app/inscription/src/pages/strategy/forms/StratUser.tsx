/**
 * 用户设置
 */

import React from 'react';

import { YInput, YSelect, FormItem } from '@/components';
import { DeviceOptions, FORM_APPID, FORM_DEVICE } from '@/config/strat.config';
import { FORM_VERSION_MIN, FORM_VERSION_MAX, FORM_CHANNEl, FORM_SOURCE } from '@/config/strat.config';
import { isNumStr } from '@/utils';
import { UseFormMethods } from 'react-hook-form';

interface StratUser {
  form: UseFormMethods;
}

const StratUser: React.FC<StratUser> = ({ form }) => {
  // 防止先设置数字后续修改为''的情况
  const handleStratChange = (value: string) => {
    if (value === '') {
      form.setValue(FORM_VERSION_MAX, null)
    }
  }

  return (
    <>
      <FormItem form name={FORM_APPID} label="APPID">
        <YInput placeholder="可输入多个，用半角逗号隔开" />
      </FormItem>
      <FormItem form name={FORM_DEVICE} label="设备系统">
        <YSelect options={DeviceOptions} />
      </FormItem>
      <div className="formitem">
        <label className="formitem-label">API版本号</label>
        <div className="formitem-content formitem-flex">
          <FormItem
            form
            name={FORM_VERSION_MIN}
            rule={{ validate: data => (isNumStr(data) === false ? '该字段需为数值类型' : undefined) }}
          >
            <YInput placeholder="最小版本" />
          </FormItem>
          <span>--</span>
          <FormItem
            form
            name={FORM_VERSION_MAX}
            rule={{ validate: data => (isNumStr(data) === false ? '该字段需为数值类型' : undefined) }}
          >
            <YInput placeholder="最大版本" onExtraChange={handleStratChange} />
          </FormItem>
        </div>
      </div>
      <FormItem form name={FORM_CHANNEl} label="渠道号">
        <YInput placeholder="可输入多个，用半角逗号隔开" />
      </FormItem>
    </>
  );
};

export default React.memo(StratUser);
