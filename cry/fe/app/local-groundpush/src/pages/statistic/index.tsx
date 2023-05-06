// 这一个页面刷了7、8遍，啊～～～绝望---LZ
import React, { useState, useCallback, useEffect, memo } from 'react';
import { connect } from 'dva';
import { Button, Table, message } from 'antd';
import { PaginationConfig, SorterResult, SortOrder } from 'antd/es/table';
import moment, { Moment } from 'moment';

import { ConnectState, Dispatch, OtherModelState } from '@/models/connect';
import { YRangePicker, YRadioButton, YSelect, ChartPolygonal, YSelOptProps } from '@/components';
import { TableDataType, PolygonalDataType } from '@/config/app.d';
import { TeamColumn, TeamCnkeyMap } from '@/config/statistic/statistic.config.tsx';
import { TeamProps, CommomTeamType } from '@/config/statistic/statistic.d';
import { exportData, parseLongFloat, stringifyDate } from '@/utils/dev_helper';
import { usePost } from '@/services/common';
import './index.less'

const allScreenTypes = [{ name: "团队", value: 'teamIds' }, { name: '城市', value: 'cityIds' }]
const polygonalIndicators = [
  { name: "有效激活设备", value: 'activationCount' }, { name: "无效激活设备", value: 'cheaterCount' }, { name: "次日留存", value: 'oneDayRetention' },
  { name: "7日留存", value: 'sevenDayRetention' }, { name: "30日留存", value: 'thirtyDayRetention' }
];

interface StatisBoardProps {
  others: OtherModelState,
  dispatch: Dispatch;
}

const StatisticBoard: React.FC<StatisBoardProps> = ({ others, dispatch }) => {
  const { allTeams, allCities } = others; // 这俩从redux当中取出来的
  const screenCache = localStorage.getItem('teamStatisticScreen');
  const initialDefaultDate = screenCache ? JSON.parse(screenCache).defaultDate : 7;
  const initialScreenType = screenCache ? JSON.parse(screenCache).screenType : 'teamIds';
  const initialQueryValue: number[] | undefined = screenCache ? JSON.parse(screenCache).queryValue : undefined;

  const initialStart = stringifyDate(Date.now() - initialDefaultDate * 24 * 3600 * 1000);
  const initialEnd = stringifyDate(Date.now() - 1 * 24 * 3600 * 1000);

  const { data: teamChartData, fetchData: fetchTeamChartData } = usePost<PolygonalDataType<CommomTeamType>>('/teamStat/data');
  const { data: teamTableData, fetchData: fetchTeamTableData } = usePost<TableDataType<TeamProps>>('/teamStat/dataPage');
  const { data: allTeamData, fetchData: fetchAllTeamData } = usePost<TableDataType<TeamProps>>('/teamStat/dataPage');

  const [selectOptions, setSelectOptions] = useState<YSelOptProps[]>([]);
  const [polyIndicator, setPolyIndicator] = useState('activationCount');
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sorter, setSorter] = useState<SortOrder>();
  const [download, setDownload] = useState(false);
  const [screenType, setScreenType] = useState(initialScreenType);
  const [queryValue, setQueryValue] = useState(initialQueryValue);
  const [startTime, setStartTime] = useState<string | undefined>(initialStart);
  const [endTime, setEndTime] = useState<string | undefined>(initialEnd);
  const [defaultDate, setDefaultDate] = useState<number>(initialDefaultDate);

  useEffect(() => {
    if (!allTeams || allTeams.length === 0) {
      dispatch({ type: 'others/fetchAllTeams' });
    }

    if (!allCities || allCities.length === 0) {
      dispatch({ type: 'others/fetchAllCities' });
    }

    fetchTeamChartData({ startTime, endTime, [screenType]: queryValue });
    fetchTeamTableData({ startTime, endTime, offset: 0, limit: 10, [screenType]: queryValue });
  }, []);

  useEffect(() => {
    if (!allTeams || !allCities) { return; }

    switch (screenType) {
      case 'cityIds':
        setSelectOptions(allCities);
        break;
      case 'teamIds':
      default:
        setSelectOptions(allTeams);
    }
  }, [screenType, allTeams, allCities]);

  useEffect(() => {
    if (!download) { return; }
    fetchAllTeamData({ startTime, endTime, offset: 0, limit: 999999, [screenType]: queryValue });
  }, [download]); // 这里不是依赖，而是判定变化的依据

  useEffect(() => {
    if (!download) { return; }

    try {
      exportData(allTeamData && allTeamData.list, "团队/区域统计数据", downloadPredeal);
    } catch (err) {
      message.error('出错了。。')
      console.log(err, "error happened in downloading....")
    } finally {
      setDownload(false);
    }
  }, [allTeamData]);

  const downloadPredeal = useCallback((dataSource: TeamProps) => {
    let { oneDayRetention, sevenDayRetention, thirtyDayRetention } = dataSource;
    let handledData = {
      ...dataSource,
      oneDayRetention: oneDayRetention && `${parseLongFloat(oneDayRetention * 100)}%`,
      sevenDayRetention: sevenDayRetention && `${parseLongFloat(sevenDayRetention * 100)}%`,
      thirtyDayRetention: thirtyDayRetention && `${parseLongFloat(thirtyDayRetention * 100)}%`
    }
    let cnEntries = Object.entries(handledData).map(([key, val]) => [TeamCnkeyMap[key], val]);
    return Object.fromEntries(cnEntries)
  }, []);

  const handleQueryOn = useCallback(() => {
    fetchTeamChartData({ startTime, endTime, [screenType]: queryValue });
    fetchTeamTableData({
      startTime,
      endTime,
      offset: (current - 1) * pageSize,
      limit: pageSize,
      desc: sorter === 'ascend' ? 'asc' : undefined,
      [screenType]: queryValue
    });
  }, [startTime, endTime, pageSize, current, sorter, screenType, queryValue]);

  const handleRangeChange = (start?: Moment, end?: Moment) => {
    setStartTime(start && start.format('YYYY-MM-DD'));
    setEndTime(end && end.format('YYYY-MM-DD'));
  };

  const handleTableChange = useCallback((
    { current = 1, pageSize = 10 }: PaginationConfig, _, { order }: SorterResult<TeamProps>
  ) => {
    setPageSize(pageSize);
    setCurrent(current);
    setSorter(order);
    fetchTeamTableData({
      startTime, endTime,
      limit: pageSize,
      offset: (current - 1) * pageSize,
      desc: order === 'ascend' ? 'asc' : undefined,
      [screenType]: queryValue
    });
  }, [screenType, queryValue, startTime, endTime]);

  const handleSaveScreen = useCallback(() => {
    localStorage.setItem(
      'teamStatisticScreen', JSON.stringify({ screenType, queryValue, defaultDate })
    );
    message.success('保存成功')
  }, [startTime, endTime, screenType, queryValue, defaultDate]);

  const handleScreenTypeChange = useCallback((val: string): void => {
    setScreenType(val);
    setQueryValue(undefined);
  }, []);

  return (
    <div className="board">
      <div className="board-screen">
        <label>日期</label>
        <YRangePicker
          onSelectChange={handleRangeChange}
          onFastsetChange={setDefaultDate}
          fastSet
          value={[moment(startTime), moment(endTime)]}
          tipContent="不含当天数据"
          defaultDate={defaultDate}
        />
      </div>
      <div className="board-screen">
        <label>筛选</label>
        <YRadioButton
          size="small"
          value={screenType}
          radioOptions={allScreenTypes}
          onChange={(e) => handleScreenTypeChange(e.target.value)}
        />
        <YSelect
          className="board-screen-select"
          mode="multiple"
          options={selectOptions}
          placeholder="请选择"
          value={queryValue}
          filter={true}
          onChange={(val: number[]) => setQueryValue(val.length > 0 ? val : undefined)}
        />
        <Button size="small" type="primary" onClick={handleQueryOn}>查询</Button>
        <Button size="small" onClick={handleSaveScreen}>保存筛选参数</Button>
      </div>
      <div className="board-chart">
        <div className="board-chart-operation">
          <YRadioButton
            size="small"
            value={polyIndicator}
            radioOptions={polygonalIndicators}
            onChange={(e) => setPolyIndicator(e.target.value)}
          />
          <Button onClick={() => setDownload(true)} icon="download" size="small" type="primary">下载CSV</Button>
        </div>
        <div className="board-chart-polygonal">
          <ChartPolygonal dataSource={teamChartData} indicators={polyIndicator} title="团队/区域统计图" />
        </div>
        <Table<TeamProps>
          className="board-chart-table"
          columns={TeamColumn}
          dataSource={teamTableData && teamTableData.list || []}
          rowKey={({ teamId, timeKey }) => `${teamId}/${timeKey}`}
          bordered
          onChange={handleTableChange}
          pagination={{
            size: 'small',
            total: teamTableData && teamTableData.total,
            pageSize: teamTableData && teamTableData.pageSize,
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: total => `总计${total}条结果`,
          }}
        />
      </div>
    </div>
  );
};

const MemedStatistic = memo(StatisticBoard);

export default connect((state: ConnectState) => {
  return { others: state.others, }
})(MemedStatistic)
