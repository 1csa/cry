import React, { memo, useCallback, useState, useEffect } from 'react';
import moment, { Moment } from 'moment';
import { DatePicker } from 'antd';
import { RangePickerProps, RangePickerValue } from 'antd/es/date-picker/interface';
import { stringifyDate } from '@/utils/dev_helper';
import './index.less';

interface YRangePickerProp extends RangePickerProps {
  fastSet?: boolean;
  tipContent?: string;
  defaultDate?: number;
  includingToday?: boolean;
  onSelectChange: (newStart?: Moment, newEnd?: Moment)=>void;
  onFastsetChange?: (newVal: number)=>void;
}

const YRangePicker: React.FC<YRangePickerProp> =({
  fastSet=false, value, tipContent, defaultDate=7, includingToday=false, onSelectChange, onFastsetChange, ...props
})=> {
  const FasterButton = [
    { name: '昨天', range: 1,}, { name: '前2天', range: 2 }, { name: '前3天', range: 3 },
    { name: '前7天', range: 7 }, { name: '前14天', range: 14 }, { name: '前30天', range: 30 }
  ];
  const [ activeButton, setActiveButton] = useState<number>(defaultDate);

  useEffect(()=>{
    let defaultStart: Moment, defaultEnd: Moment, defaultActive: number;

    if(typeof defaultDate === 'number') {
      defaultActive = defaultDate;
      defaultEnd = defaultDate > 0 ? moment(new Date().valueOf()-24*3600*1000) : moment(Date.now());
      defaultStart = moment(new Date().valueOf()- defaultDate* 24*3600*1000);
    } else {
      defaultStart = moment(defaultDate[0], 'YYYY-MM-DD');
      defaultEnd = moment(defaultDate[1], 'YYYY-MM-DD');
      defaultActive = Math.ceil((defaultEnd.valueOf()-defaultStart.valueOf())/24*3600*1000);
    }

    onSelectChange(defaultStart, defaultEnd);
    setActiveButton(defaultActive);
  }, [defaultDate]);

  const handleFastDateSet = useCallback((range: number)=>{
    let startDate = new Date().valueOf()-range * 24 * 3600 * 1000;

    let endDate = range===0 ? Date.now() : Date.now()-24*3600*1000;

    console.log(moment(endDate).format('YYYY-MM-DD'))

    setActiveButton(range);
    onFastsetChange && onFastsetChange(range);
    onSelectChange(moment(startDate), moment(endDate));
  }, []);

  const handleRangerChange = useCallback((dates: RangePickerValue)=>{
    let [ newStartDate, newEndDate ] = dates;
    let lastDay = moment(new Date().valueOf()-24*3600*1000)
    let newActiveButton: number = 0;

    if ( newStartDate && newEndDate && stringifyDate(newEndDate) === stringifyDate(lastDay)) {
      newActiveButton = Math.floor((newEndDate.valueOf()-newStartDate.valueOf())/(24*3600*1000))+1
    }

    setActiveButton(newActiveButton);
    onSelectChange(dates[0], dates[1]);
  }, []);

  return <div className="yrangepicker">
    <DatePicker.RangePicker
      disabledDate={ date => date ? date.valueOf() > new Date().valueOf() : false}
      className="yrangepicker-picker"
      value={value}
      onChange={handleRangerChange} {...props}
      size="small"
    />
    {
      includingToday && <a
        className={`yrangepicker-button ${activeButton === 0 ? 'yrangepicker-button-active': '' }`}
        key={'今天'}
        onClick={()=>handleFastDateSet(0)}
      >今天</a>
    }
    {
      fastSet && FasterButton.map(fastItem=><a
         className={`yrangepicker-button ${activeButton === fastItem.range ? 'yrangepicker-button-active': '' }`}
         key={fastItem.name}
         onClick={()=>handleFastDateSet(fastItem.range)}
        >{fastItem.name}</a>
      )
    }
    {
      tipContent && <p className="yrangepicker-tip">{tipContent}</p>
    }
  </div>
};

export default memo(YRangePicker);

