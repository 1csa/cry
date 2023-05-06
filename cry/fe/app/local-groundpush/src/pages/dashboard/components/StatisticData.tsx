import React, { memo, useState, useCallback, useEffect } from 'react';
import { Moment } from 'moment';
import { RangePickerValue } from 'antd/es/date-picker/interface';

import { YRangePicker, ChartPie } from '@/components';
import { stringifyDate } from '@/utils/dev_helper';
import { usePost } from '@/services/common';
import { PieDataType } from '@/config/app.d';
import '../index.less';

const StatisticData =()=> {
  const { data: cityDatas, fetchData: fetchCityDatas } = usePost<PieDataType[]>('/home/cityDatas');
  const { data: teamDatas, fetchData: fetchTeamDatas } = usePost<PieDataType[]>('/home/teamDatas');

  const [ startDate, setStartDate ] = useState<Moment>();
  const [ endDate, setEndDate ] = useState<Moment>();

  useEffect(()=>{
    let startTime = startDate && stringifyDate(startDate);
    let endTime = endDate && stringifyDate(endDate);

    if (startTime || endTime) {
      fetchCityDatas({ startTime, endTime });
      fetchTeamDatas({ startTime, endTime });
    }
  }, [startDate, endDate]);

  // 这里还需要重新触发数据的重新请求
  const handleRangeChange = useCallback((start?: Moment, end?: Moment)=>{
    setStartDate(start);
    setEndDate(end);
  }, []);

  return <>
    <div className="dashboard-title">
      <h3>统计数据</h3>
    </div>
    <div className="dashboard-container">
      <div className="dashboard-container-screen">
        <label>日期</label>
        <YRangePicker
          fastSet={true}
          tipContent="不含当天数据"
          defaultDate={7}
          value={[startDate, endDate] as RangePickerValue}
          onSelectChange={handleRangeChange}
        />
      </div>
      <h3>新增激活分布</h3>
      <ChartPie title={`按城市  ${startDate && stringifyDate(startDate)} ~ ${endDate && stringifyDate(endDate)}`} dataSource={cityDatas}/>
      <ChartPie title={`按团队  ${startDate && stringifyDate(startDate)} ~ ${endDate && stringifyDate(endDate)}`} dataSource={teamDatas}/>
    </div>
  </>;
};

export default memo(StatisticData);
