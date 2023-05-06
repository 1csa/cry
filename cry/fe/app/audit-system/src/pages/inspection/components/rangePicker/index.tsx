import React, { useState } from 'react';
import { Moment } from 'moment';

import { DatePicker } from 'antd';

interface DateRangePickerProps {
  range?: number;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ range, ...otherProps }) => {
  const [dates, setDates] = useState<[Moment, Moment] | any>();
  const [hackValue, setHackValue] = useState<any>();
  const [value, setValue] = useState<[Moment, Moment] | any>();

  const disabledDate = (current: any) => {
    if (typeof range === 'undefined') return false;
    if (!dates || dates.length === 0) return false;

    const tooLate = dates[0] && current.diff(dates[0], 'days') > range;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > range;

    return tooEarly || tooLate;
  };

  const onOpenChange = (open: any) => {
    if (open) {
      setHackValue([]);
      setDates([]);
    } else {
      setHackValue(undefined);
    }
  };

  return (
    <DatePicker.RangePicker
      {...otherProps}
      value={hackValue || value}
      disabledDate={disabledDate}
      onCalendarChange={(val: any) => setDates(val)}
      onChange={(val: any) => setValue(val)}
      onOpenChange={onOpenChange}
    />
  );
};

export default DateRangePicker;
