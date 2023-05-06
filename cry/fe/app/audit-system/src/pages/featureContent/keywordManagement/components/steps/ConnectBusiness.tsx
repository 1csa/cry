import React, { useState, useImperativeHandle } from 'react';
import { Form, Radio, DatePicker } from 'antd';
import EffectiveInfo, { EffectKeyType } from '../../components/EffectiveInfo';
import { initDefaultValue } from '../../model/utils';
import { formItemLayout } from '../KeywordSettingForm';
import { DATE_FORMAT_SS } from '@/utils/dev_helper';
import moment from 'moment';

const { RangePicker } = DatePicker;
export interface IHandler {
  onFinish: () => {};
}

const ConnectBusiness = React.forwardRef<IHandler, {}>(({}, ref) => {
  const [form] = Form.useForm();
  const nowDate = moment(moment(new Date()).format(DATE_FORMAT_SS), DATE_FORMAT_SS);
  const getInitValue = () => initDefaultValue({});

  // 设置是否 生效时间被禁止
  const [disabledDateRadio, setDateRadioValue] = useState<number>(getInitValue().time_range);
  const [effectiveData, setEffectiveData] = useState<Record<EffectKeyType, string | number>[]>([]);
  // 时间区间
  const [rangeDate, setRangeDate] = useState<any>(getInitValue().rangeDate);

  const onFinish = async () => {
    let values = await form.validateFields();
    values.time_range = values.time_range === 1 ? [nowDate, moment('2999/12/31 23:59:59', DATE_FORMAT_SS)] : rangeDate;
    return {
      actions: effectiveData,
      startTime: new Date(values.time_range[0]).getTime(),
      endTime: new Date(values.time_range[1]).getTime(),
    };
  };

  useImperativeHandle(ref, () => ({
    onFinish,
  }));
  // 切换生效时间单选按钮
  const handleTimeRadio = (event: any) => {
    setDateRadioValue(event.target.value);
  };
  // 日期组件数据改变
  const handleDateChange = (value: any, dateString: Array<string>) => {
    setRangeDate(value);
  };

  return (
    <Form form={form} name="horizontal_search_setting_form" onFinish={onFinish} {...formItemLayout} initialValues={getInitValue()}>
      <Form.Item label="生效信息" rules={[{ required: true }]}>
        <EffectiveInfo editType={true} handleData={(data: any[]) => setEffectiveData(data)} initCellValue={getInitValue()} />
      </Form.Item>
      <Form.Item label="生效时间段" name="time_range" rules={[{ required: true }]}>
        <Radio.Group onChange={handleTimeRadio}>
          <Radio value={1}>永久</Radio>
          <Radio value={2}>
            <RangePicker
              disabled={disabledDateRadio === 1 ? true : false}
              showTime
              defaultValue={rangeDate}
              format={DATE_FORMAT_SS}
              onChange={handleDateChange}
            />
          </Radio>
        </Radio.Group>
      </Form.Item>
    </Form>
  );
});

export default ConnectBusiness;
