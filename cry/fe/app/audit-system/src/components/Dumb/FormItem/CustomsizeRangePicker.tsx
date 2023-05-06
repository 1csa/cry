import React from 'react';
import { Form, DatePicker } from 'antd';

import { BaseFormModelType } from '@/types';
import { formateTime } from '@/utils/dev_helper';

const { RangePicker } = DatePicker;

// 日期一些参数
interface ICustomizeDatePicker {
  dateProps: BaseFormModelType;
  handleDate: ([string]: any) => void;
}

// 后期可以拓展通过showTime有无 来确定要不要展示时分秒选择
const CustomizeDatePicker: React.FC<ICustomizeDatePicker> = ({ dateProps, handleDate }) => {
  const handleTimeChange = (value: any, dateString: Array<string>) => {
    const [start, end] = dateString;
    const [timeStart, timeEnd] = dateProps?.timeKey || [];

    const time = {
      [timeStart]: start ? (dateProps?.formateTime ? formateTime(new Date(start).getTime() / 1000) : new Date(start).getTime() / 1000) : undefined,
      [timeEnd]: end ? (dateProps?.formateTime ? formateTime(new Date(end).getTime() / 1000) : new Date(end).getTime() / 1000) : undefined,
    };
    // 处理时间
    const key: string = dateProps?.name as string;
    handleDate && handleDate({ [key]: time });
  };

  return (
    <Form.Item label={dateProps?.label} name={dateProps?.name} rules={dateProps?.rules}>
      {dateProps?.type === 'datePicker' ? (
        <DatePicker showTime format={dateProps?.format || 'YYYY/MM/DD HH:mm:ss'} />
      ) : (
        <RangePicker
          style={{ width: dateProps?.width || 400 }}
          showTime
          format={dateProps?.format || 'YYYY/MM/DD HH:mm:ss'}
          onChange={handleTimeChange}
          disabledDate={dateProps?.disabledDateStemp && (current => dateProps?.disabledDateStemp! && dateProps?.disabledDateStemp!(current))}
        />
      )}
    </Form.Item>
  );
};

export default CustomizeDatePicker;
