import React from 'react';
import { useSelector } from 'dva';
import { useField } from 'formik';
import { FormItem, Select, Input, Radio } from 'formik-antd';

import { platform_map } from '@/data';
import { parseselect} from '@/utils';

import { syncplatformSelector } from '@/selectors/editorpush';
import { engnumWithSerpValidate, numWithSerpValidate } from '@/validation/editorpush';

interface FormikItemProps {
  fieldname: string;
  children: React.ReactElement;
}

export const FormikPushClient: React.FC<FormikItemProps> = React.memo(({ fieldname, children }) => {
  const [_, { value }] = useField(fieldname);

  return React.cloneElement(children, { value });
});

// appid
export const AppidFormItem: React.FC = React.memo(() => {
  const validator = (value: string) => engnumWithSerpValidate(value, '包含APPID');
  return (
    <FormItem className="form-item" name="appid" label="包含APPID" validate={validator}>
      <Input name="appid" />
    </FormItem>
  );
});

// 排除appid
export const ExappidFormItem: React.FC = React.memo(() => {
  const validator = (value: string) => engnumWithSerpValidate(value, '排除APPID');
  return (
    <FormItem className="form-item" name="exappid" label="排除APPID" validate={validator}>
      <Input name="exappid" placeholder="请输入排除appid，用英文逗号分隔" />
    </FormItem>
  );
});

// 触达平台
export const PlatformFormItem: React.FC = React.memo(() => {
  return (
    <FormItem className="form-item" name="platform" label="触达平台">
      <Select name="platform" mode="multiple" allowClear>
        {parseselect(platform_map)}
      </Select>
    </FormItem>
  );
});

// 同步触达端
export const SyncFormItem: React.FC = React.memo(() => {
  const syncplatformMap = useSelector(syncplatformSelector);

  return (
    <FormItem className="form-item" name="sync_platform" label="同步触达端">
      <Select name="sync_platform" mode="multiple" allowClear>
        {parseselect(syncplatformMap)}
      </Select>
    </FormItem>
  );
});

// 最小api版本
export const MinapiFormItem: React.FC = React.memo(() => {
  return (
    <FormItem className="form-item" name="inVersion" label="最小API版本">
      <Input name="inVersion" placeholder="请输入最小api版本号" />
    </FormItem>
  );
});

// 排除api版本
export const ExapiFormItem: React.FC = React.memo(() => {
  const validator = (value: string) => numWithSerpValidate(value, '排除API版本');
  return (
    <FormItem className="form-item" name="exVersion" label="排除API版本" validate={validator}>
      <Input name="exVersion" placeholder="请输入排除API版本，使用英文逗号分隔。" />
    </FormItem>
  );
});

// 最小客户端版本
export const MinclientFormItem: React.FC = React.memo(() => {
  return (
    <FormItem className="form-item" name="inClientVersion" label="最小客户端版本">
      <Input name="inClientVersion" placeholder="请输入最小客户端版本号" />
    </FormItem>
  );
});

// 排除客户端版本
export const ExclientFormItem: React.FC = React.memo(() => {
  const validator = (value: string) => numWithSerpValidate(value, '排除客户端版本');
  return (
    <FormItem className="form-item" name="exClientVersion" label="排除客户端版本" validate={validator}>
      <Input name="exClientVersion" placeholder="请输入排除客户端版本，使用英文逗号分隔。" />
    </FormItem>
  );
});

// 冠名推送
export const AdcodeFormItem: React.FC = React.memo(() => {
  return (
    <FormItem className="form-item" name="ad_code" label="冠名推送">
      <Radio.Group name="ad_code" defaultValue={'1'}>
        <Radio value='1' name="close">关闭</Radio>
        <Radio value='2' name="open">开启</Radio>
      </Radio.Group>
    </FormItem>
  );
});
