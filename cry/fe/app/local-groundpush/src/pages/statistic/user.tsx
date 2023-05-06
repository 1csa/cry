import React, { useCallback, useState, memo, useEffect } from 'react';
import { connect } from 'dva';
import moment, { Moment } from 'moment';
import { Button, Table, message } from 'antd';
import { PaginationConfig, SorterResult } from 'antd/es/table';

import { YRangePicker, YRadioButton, YSelect, YSelOptProps, YTagInput } from '@/components';
import { ConnectState, Dispatch, OtherModelState } from '@/models/connect';
import { UserColumn, UserCnKeyMap } from '@/config/statistic/statistic.config.tsx';
import { UserProps, BasicUserScreen } from '@/config/statistic/statistic.d';
import { TableDataType } from '@/config/app.d';
import { usePost } from '@/services/common';
import { exportData, stringifyDate } from '@/utils/dev_helper';
import './index.less';

const allScreenTypes = [
  {
    name: '团队',
    value: 'teamIds',
  },
  {
    name: '地推员',
    value: 'pushManIds',
  },
  {
    name: '用户uid',
    value: 'userIds',
  },
];

interface UserBoardProps {
  others: OtherModelState;
  dispatch: Dispatch;
}

const UserStatisticBoard: React.FC<UserBoardProps> = ({ others, dispatch }) => {
  const { allTeams, allPushers } = others;
  const screenCache = localStorage.getItem('userStatisticScreen');
  const initialBasicScreen: Partial<BasicUserScreen> = screenCache
    ? JSON.parse(screenCache).basicScreen
    : { limit: 10, offset: 0 };
  const initialScreenType: string = screenCache ? JSON.parse(screenCache).screenType : 'teamIds';
  const initialQueryValue: number[] | undefined = screenCache
    ? JSON.parse(screenCache).queryValue
    : undefined;
  const initialDefaultDate = screenCache ? JSON.parse(screenCache).defaultDate : 7;

  const initialStart = stringifyDate(Date.now() - initialDefaultDate * 24 * 3600 * 1000);
  const initialEnd = stringifyDate(Date.now() - 1 * 24 * 3600 * 1000);

  const { data: userTableData, fetchData: fetchUserTableData } = usePost<TableDataType<UserProps>>(
    '/userInfo/list',
  );
  const { data: allUserData, fetchData: fetchAllUserData } = usePost<TableDataType<UserProps>>(
    '/userInfo/list',
  );

  const [screenType, setScreenType] = useState<string>(initialScreenType);
  const [selectOptions, setSelectOptions] = useState<YSelOptProps[]>([]);
  const [basicScreen, setBasicScreen] = useState<Partial<BasicUserScreen>>(initialBasicScreen);
  const [download, setDownload] = useState(false);
  const [queryValue, setQueryValue] = useState(initialQueryValue);
  const [defaultDate, setDefaultDate] = useState<number>(initialDefaultDate);
  const [startTime, setStartTime] = useState<string | undefined>(initialStart);
  const [endTime, setEndTime] = useState<string | undefined>(initialEnd);

  useEffect(() => {
    if (!allTeams || allTeams.length === 0) {
      dispatch({ type: 'others/fetchAllTeams' });
    }
    if (!allPushers || allPushers.length === 0) {
      dispatch({ type: 'others/fetchAllPushers' });
    }
    fetchUserTableData({ ...basicScreen, startTime, endTime, [screenType]: queryValue });
  }, []);

  useEffect(() => {
    if (!allTeams || !allPushers) {
      return;
    }

    let teamOptions: YSelOptProps[] = allTeams,
      pusherOptions: YSelOptProps[] = allPushers.map(({ id, name, phone }) => ({
        value: id,
        title: `${name}-${id}-${phone}`,
      }));

    switch (screenType) {
      case 'pushManIds':
        setSelectOptions(pusherOptions);
        break;
      case 'teamIds':
      default:
        setSelectOptions(teamOptions);
    }
  }, [screenType, allTeams, allPushers]);

  useEffect(() => {
    if (!download) {
      return;
    }
    fetchAllUserData({
      ...basicScreen,
      startTime,
      endTime,
      offset: 0,
      limit: 999999,
      [screenType]: queryValue,
    });
  }, [download]); // 这里不是依赖，而是判定变化的依据

  useEffect(() => {
    if (!download) {
      return;
    }

    try {
      exportData(allUserData && allUserData.list, '用户详情数据', downloadPredeal);
    } catch (err) {
      message.error('出错了。。');
      console.log(err, 'error happened in downloading....');
    } finally {
      setDownload(false);
    }
  }, [allUserData]);

  const handleScreenTypeChange = useCallback((val: string): void => {
    setQueryValue(undefined);
    setScreenType(val);
  }, []);

  const handleQueryOn = useCallback(() => {
    fetchUserTableData({ ...basicScreen, startTime, endTime, [screenType]: queryValue });
  }, [basicScreen, screenType, queryValue, startTime, endTime]);

  const handleRangeChange = useCallback((start?: Moment, end?: Moment) => {
    setStartTime(start && start.format('YYYY-MM-DD'));
    setEndTime(end && end.format('YYYY-MM-DD'));
  }, []);

  const handleTableChange = useCallback(
    ({ current = 1, pageSize = 10 }: PaginationConfig, _, { order }: SorterResult<UserProps>) => {
      let newScreenParams = {
        limit: pageSize,
        offset: pageSize * (current - 1),
        desc: order === 'ascend' ? ('asc' as const) : undefined,
      };
      fetchUserTableData({ ...newScreenParams, startTime, endTime, [screenType]: queryValue });
      setBasicScreen(newScreenParams);
    },
    [basicScreen, startTime, endTime, screenType, queryValue],
  );

  const downloadPredeal = useCallback((dataSource: UserProps) => {
    let {
      timeKey,
      teamName,
      teamId,
      userId,
      appVersion = '--',
      os = '--',
      city = '--',
      lat = '--',
      lng = '--',
      activationTime = '--',
    } = dataSource;
    let dataTransed = {
      timeKey,
      teamName,
      teamId,
      userId,
      appVersion,
      activationTime,
      os: os === 0 ? 'IOS' : 'Android', // 这里暂时用OS作为机型信息
      activationPlace: `${city} ${lat} ${lng}`,
    };

    let cnEntries = Object.entries(dataTransed).map(([key, val]) => [UserCnKeyMap[key], val]);
    return Object.fromEntries(cnEntries);
  }, []);

  const handleSaveScreen = useCallback(() => {
    localStorage.setItem(
      'userStatisticScreen',
      JSON.stringify({ basicScreen, screenType, queryValue, defaultDate }),
    );
    message.success('修改成功');
  }, [basicScreen, startTime, endTime, screenType, queryValue, defaultDate]);

  return (
    <div className="board">
      <div className="board-screen">
        <label>日期</label>
        <YRangePicker
          onSelectChange={handleRangeChange}
          onFastsetChange={setDefaultDate}
          value={[moment(startTime), moment(endTime)]}
          fastSet
          tipContent="不含当天数据"
          defaultDate={defaultDate}
        />
      </div>
      <div className="board-screen">
        <label className="board-screen-label">筛选</label>
        <YRadioButton
          size="small"
          value={screenType}
          radioOptions={allScreenTypes}
          onChange={e => handleScreenTypeChange(e.target.value)}
        />
        {
          {
            teamIds: (
              <YSelect
                className="board-screen-select"
                mode="multiple"
                filter={true}
                value={queryValue}
                options={selectOptions}
                placeholder="请选择团队"
                onChange={val => setQueryValue(val && val.length !== 0 ? val : undefined)}
              />
            ),
            pushManIds: (
              <YSelect
                className="board-screen-select board-screen-select-pusher"
                mode="multiple"
                filter={true}
                value={queryValue}
                options={selectOptions}
                placeholder="请选择地推员(name-id-phone)"
                onChange={val => setQueryValue(val && val.length !== 0 ? val : undefined)}
              />
            ),
            userIds: (
              <YTagInput
                className="board-screen-input"
                tagTip="请输入用户UID"
                tags={queryValue}
                onChange={val =>
                  setQueryValue(val && val.length !== 0 ? (val as number[]) : undefined)
                }
              />
            ),
          }[screenType]
        }
        <Button size="small" type="primary" onClick={handleQueryOn}>
          查询
        </Button>
        <Button size="small" onClick={handleSaveScreen}>
          保存筛选参数
        </Button>
      </div>
      <div className="board-chart">
        <div className="board-chart-operation">
          <div /> {/* 用来调整样式*/}
          <Button
            className="board-chart-operation-download"
            icon="download"
            size="small"
            type="primary"
            onClick={() => setDownload(true)}
          >
            下载CSV
          </Button>
        </div>
        <Table<UserProps>
          className="board-chart-table"
          columns={UserColumn}
          dataSource={(userTableData && userTableData.list) || []}
          // dataSource={testData}
          rowKey="userId"
          bordered
          onChange={handleTableChange}
          pagination={{
            size: 'small',
            total: userTableData && userTableData.total,
            pageSize: userTableData && userTableData.pageSize,
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: total => `总计${total}条结果`,
          }}
        />
      </div>
    </div>
  );
};

const memedUserBoard = memo(UserStatisticBoard);

export default connect((state: ConnectState) => ({
  others: state.others,
}))(memedUserBoard);
