import React from 'react';
import moment from 'moment';
import cn from 'classnames';
import { DatePicker } from 'antd';
import { useFormContext } from 'react-hook-form';

import { FormItem } from '@/types/comp';
import { TIME_FORMAT } from '@/config/app.config';
import './index.less';

// datepicker需要将对应的startTime和endTime的key值给过来
interface YRangePicker extends FormItem {
  startTime: string;
  endTime: string;
}

// 这里因为用来代理value的表单是input类型，且为非受控类型，所以watch拿到的类型总是为string类型
const YRangePicker: React.FC<YRangePicker> = ({ className, children, startTime, endTime }) => {
  const { setValue, register, watch } = useFormContext();

  const start = watch(startTime) - 0;
  const end = watch(endTime) - 0;

  const startDate = start ? moment(new Date(start)) : null;
  const endDate = end ? moment(new Date(end)) : null;

  const handleRangerChange = (_, dateString) => {
    const [start, end] = dateString || [];

    const startTimekey = new Date(start).getTime();
    const endTimekey = new Date(end).getTime();

    setValue(startTime, startTimekey);
    setValue(endTime, endTimekey);
  };

  return (
    <div className={cn(className, 'yranger')}>
      <input type="number" name={startTime} ref={register} style={{ display: 'none' }} />
      <input type="number" name={endTime} ref={register} style={{ display: 'none' }} />
      <DatePicker.RangePicker
        className="yranger-picker"
        size="small"
        showTime={true}
        format={TIME_FORMAT}
        value={[startDate, endDate]}
        onChange={handleRangerChange}
      />
      <div className="yranger-other">{children}</div>
    </div>
  );
};

export default React.memo(YRangePicker);
