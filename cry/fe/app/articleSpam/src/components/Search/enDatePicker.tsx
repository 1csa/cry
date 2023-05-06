import React, { FC, memo, useEffect } from 'react';
import { Form, DatePicker } from 'antd';
import moment from 'moment';
import { RangePickerValue } from 'antd/lib/date-picker/interface';

interface ISelectProps {
  label: string;
  format?: string;
  showTime?: boolean;
  defaultValue?: [moment.Moment, moment.Moment];
  onChange?: (date: RangePickerValue) => void;
}
// 带label的Input组件
const ENDatePicker: FC<ISelectProps> = memo((props) => {
  const {
    label,
    format,
    onChange,
    showTime,
    defaultValue
  } = props;
  useEffect(()=>{
    // console.log("onDate");
  });

  const handleOnChange = (date: RangePickerValue) => {
    // console.log('date:', date);
    onChange && onChange(date);
  }
  return (
    <Form.Item label={label}>
      <DatePicker.RangePicker
        defaultValue={defaultValue}
        format={format}
        showTime={showTime}
        onChange={handleOnChange}
        style={{width: 380}}
      />
    </Form.Item>
  );
});

ENDatePicker.defaultProps = {
  format: 'YYYY-MM-DD HH:mm:ss',
  showTime: true
}

export default ENDatePicker;
