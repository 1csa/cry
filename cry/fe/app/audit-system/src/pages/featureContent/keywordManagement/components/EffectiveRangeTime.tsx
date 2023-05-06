import React, { useState } from 'react';

import { Form, Radio, DatePicker } from 'antd';

import { DATE_FORMAT_SS } from '@/utils/dev_helper';
import { formatDate } from '../model/utils';

const { RangePicker } = DatePicker;

interface ITableProps {
  defaultValue?: number; // 1 | 2;
}

const EffectiveRangeTime: React.FC<ITableProps> = ({ defaultValue }) => {
  // 设置是否 生效时间被禁止
  const [disabledDateRadio, setDateRadioValue] = useState<number>(defaultValue || 1);

  // // 时间区间
  // const [rangeDate] = useState<any>(
  //   Array.isArray(defaultRangeDate) && defaultRangeDate.length === 2
  //     ? defaultRangeDate
  //     : [formatDate(new Date()), formatDate(new Date('2999-12-31 23:59:59'))],
  // );

  // 切换生效时间单选按钮
  const handleTimeRadio = (event: any) => {
    setDateRadioValue(event.target.value);
  };
  // // 日期组件数据改变
  // const handleDateChange = (value: any) => {
  //   // getRangeDate(value);
  // };

  return (
    <>
      <Form.Item label="生效时间段" name="time_range" rules={[{ required: true }]}>
        <Radio.Group onChange={handleTimeRadio}>
          <Radio value={1}>永久</Radio>
          <Radio value={2}>
            非永久
            {/* <RangePicker
              disabled={disabledDateRadio === 1 ? true : false}
              showTime
              defaultValue={rangeDate}
              format={DATE_FORMAT_SS}
              onChange={handleDateChange}
            /> */}
          </Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item label="生效时间段" name="rangeDate" rules={[{ required: true }]} style={{ display: disabledDateRadio === 2 ? 'block' : 'none' }}>
        <RangePicker showTime format={DATE_FORMAT_SS} allowClear={false} />
      </Form.Item>
    </>
  );
};
export default EffectiveRangeTime;
