import React from 'react';
import moment from 'moment';
import { DatePicker } from 'antd';
import { DatePickerProps } from 'antd/es/date-picker';

interface TimePicker<VT = number> extends Omit<DatePickerProps, 'value' | 'onChange' | 'onBlur'> {
  value?: VT | null;
  onBlur?: () => void;
  onChange?: (value: VT) => void;
}

export const YTimePicker: React.FC<TimePicker> = React.memo(({ value, onBlur, onChange, ...timeprops }) => {
  const timeValue = value ? moment(new Date(value)) : null;

  return (
    <DatePicker
      showTime
      size="small"
      onBlur={onBlur}
      value={timeValue}
      onChange={(_, time) => onChange && onChange(new Date(time).getTime())}
      {...timeprops}
    />
  );
});

export const YDatePicker: React.FC<TimePicker<string>> = React.memo(({ value, onBlur, onChange, ...timeprops }) => {
  const timeValue = value ? moment(new Date(value)) : null;

  return (
    <DatePicker 
      showTime={{format: "HH:mm:ss"}} 
      size="small" 
      value={timeValue} 
      onChange={(_, time) => onChange && onChange(time)} 
      {...timeprops}
    />
  );
});

