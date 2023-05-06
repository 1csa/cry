import React, { useCallback, useState, useEffect } from 'react';
import { useRouteMatch, useHistory } from 'react-router';
import { Table, Divider, Tooltip } from 'antd';
import { TableProps } from 'antd/es/table';
import { connect } from 'dva';

import { YIcon, YLink, YModal } from '@/components';
import { LaunchListColumn, defaultScreen, LIST_ID, LIST_STATUS, STATUS_TODO, STATUS_ING } from '@/config/launch.config';
import { useModeContext } from '@/hooks';
import { LaunchList, ListScreen, FormScreen, LaunchScreen } from '@/types/launch';
import { ConnectState, Dispatch, LaunchModelState, CardModelState } from '@/types/connect';
import { parseRecord, parseTimekey } from '@/utils';

import LaunchScreenForm from './screen';
import './index.less';

interface LaunchListType extends LaunchModelState, CardModelState {
  dispatch: Dispatch;
}

const InitListScreen: ListScreen = { page: 1, pageCount: 10 };
const InitFormScreen: FormScreen = defaultScreen;

const LaunchList: React.FC<LaunchListType> = ({
  dispatch,
  launchList,
  launchTotal,
  launchOption = [],
  cardOption = [],
}) => {
  const [listScreen, setListScreen] = useState<ListScreen>(InitListScreen);
  const [formScreen, setFormScreen] = useState<FormScreen>(InitFormScreen);
  const [showScreen, setShowScreen] = useState<boolean>(false);

  const history = useHistory();
  const route = useRouteMatch();
  const modeContext = useModeContext();

  const mode = modeContext.mode;

  // 复制确认
  const handleCopyConfirm = useCallback(
    (id: number) => {
      dispatch({
        type: 'launch/copylaunch',
        payload: { id, mode },
        callback: ()=> history.push(`${route.path}/new`)
      });
    },
    [mode, listScreen, formScreen],
  );

  // 停止投放确认
  const handleStopConfirm = useCallback(
    (id: number) => {
      dispatch({
        type: 'launch/stoplaunch',
        payload: { id, mode, listQuery: { ...formScreen, ...listScreen } },
      });
    },
    [mode, listScreen, formScreen],
  );

  // 表格变化
  const handleTableChange = pager => {
    const newListScreen = { page: pager.current || 1, pageCount: pager.pageSize || 10 };

    setListScreen(newListScreen);
    fetchList({ ...newListScreen, ...formScreen });
  };

  const handleScreenConfirm = screen => {
    const newScreen = parseRecord<FormScreen>(screen);

    console.log(newScreen, 'newScreen');

    setShowScreen(false);
    setFormScreen(newScreen);
    setListScreen({ ...listScreen, page: 1 });

    fetchList({ ...newScreen, ...listScreen, page: 1 });
  };

  // 获取数据
  const fetchList = useCallback(
    (query: LaunchScreen, callback?: (...args: any[]) => void) => {
      dispatch({
        type: 'launch/fetchlist',
        payload: { query: query, mode },
        callback: callback,
      });
    },
    [mode],
  );

  const renderOperation = (_: any, record: LaunchList): React.ReactElement => {
    return (
      <div className="launchlist-list-operation">
        <YLink type="link" to={`${route.path}/${record[LIST_ID]}`}>
          查看
        </YLink>
        <YModal
          type="func"
          label="复制"
          buttonProps={{ type: 'link' }}
          funcProps={{ title: '确定复制该卡片', onOk: () => handleCopyConfirm(record[LIST_ID]) }}
        />
        {[STATUS_TODO, STATUS_ING].includes(record[LIST_STATUS]) ? (
          <YModal
            type="func"
            label="停止"
            buttonProps={{ type: 'link' }}
            funcProps={{ title: '确定停用该卡片', onOk: () => handleStopConfirm(record[LIST_ID]) }}
          />
        ) : null}
      </div>
    );
  };

  const renderTime = (_: any, record: LaunchList): React.ReactElement => {
    return (
      <>
        <Tooltip title={record.create_timekey ? parseTimekey(Number(record.create_timekey)) : '--'}>
          <p className="formcontent">创建时间:{record.create_timekey ? parseTimekey(Number(record.create_timekey)) : '--'}</p>
        </Tooltip>
        <Tooltip title={record.launch_start ? parseTimekey(Number(record.launch_start)) : '--'}>
          <p className="formcontent">投放时间:{record.launch_start ? parseTimekey(Number(record.launch_start)) : '--'}</p>
        </Tooltip>
        <Tooltip title={record.launch_end ? parseTimekey(Number(record.launch_end)) : '--'}>
          <p className="formcontent">结束时间:{record.launch_end ? parseTimekey(Number(record.launch_end)) : '--'}</p>
        </Tooltip>
      </>
    )
  }

  const renderCardMsg = (_: any, record: LaunchList): React.ReactElement => {
    return (
      <>
        <Tooltip title={record.launch_name ? record.launch_name : '--'}>
          <p className="formcontent">投放标题:{record.launch_name ? record.launch_name : '--'}</p>
        </Tooltip>
        <Tooltip title={record.launch_remark ? record.launch_remark : '--'}>
          <p className="formcontent">投放说明:{record.launch_remark ? record.launch_remark : '--'}</p>
        </Tooltip>
      </>
    )
  }


  useEffect(() => {
    fetchList(listScreen);
  }, []);

  return (
    <div className="launchlist">
      <section className="launchlist-header">
        <h3>
          <YIcon type="bank" />
          <span>投放管理</span>
        </h3>
        <div className="launchlist-header-operation">
          <YModal
            type="drawer"
            label="筛选"
            showModal={showScreen}
            content={
              <LaunchScreenForm
                cardOption={cardOption}
                launchOption={launchOption}
                dispatch={dispatch}
                onConfirm={handleScreenConfirm}
              />
            }
            onShowModal={() => setShowScreen(true)}
            onCloseModal={() => setShowScreen(false)}
          />
          <YLink type="button" to={`${route.path}/new`}>
            新增
          </YLink>
        </div>
      </section>
      <Divider />
      <section>
        <Table<LaunchList>
          rowKey={LIST_ID}
          dataSource={launchList}
          pagination={{
            total: launchTotal,
            current: listScreen.page,
            pageSize: listScreen.pageCount,
            size: 'small',
            showSizeChanger: true,
          }}
          onChange={handleTableChange}
        >
          {LaunchListColumn.map(column => (
            <Table.Column key={column.key} {...column} />
          ))}
          <Table.Column<LaunchList> key="information" title="投放信息" width={240} render={renderCardMsg} />
          <Table.Column<LaunchList> key="time" title="时间" width={240} render={renderTime} />
          <Table.Column<LaunchList> key="operation" title="操作" width={180} render={renderOperation} />
        </Table>
      </section>
    </div>
  );
};

export default connect(({ launch, card }: ConnectState) => ({
  ...launch,
  cardOption: card.cardOption,
}))(React.memo(LaunchList));
