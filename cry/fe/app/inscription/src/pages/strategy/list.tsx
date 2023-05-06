import React, { useCallback, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouteMatch, useHistory } from 'react-router';
import { Table, Divider, Tooltip } from 'antd';
import { TableProps } from 'antd/es/table';
import { connect } from 'dva';

import { StratScreen } from '@/pages/strategy/forms';
import { useModeContext } from '@/hooks';
import { YIcon, YLink, YModal } from '@/components';
import { AUTH_STRAT_EDIT } from '@/config/app.config';
import { StratListColumn, LIST_ID, LIST_STATUS, STATUS_UNABLE } from '@/config/strat.config';
import { StrategyList, StrategyScreen, ListScreen, FormScreen } from '@/types/strat';
import { ConnectState, Dispatch, StratModelState, UserModelState } from '@/types/connect';
import { parseTimekey } from '@/utils';
import './index.less';
import ScreenForm from '../cards/forms/ScreenForm';

interface StratList extends StratModelState, UserModelState {
  dispatch: Dispatch;
}

const InitialListScreen: ListScreen = { page: 1, pageCount: 10 };
const InitialFormScreen: FormScreen = {};

const StratList: React.FC<StratList> = ({ dispatch, stratTotal, stratList, authes }) => {
  const route = useRouteMatch();
  const history = useHistory();
  const form = useForm<FormScreen>(InitialFormScreen);
  const modeContext = useModeContext();

  const mode = modeContext.mode;

  const [listScreen, setListScreen] = useState<ListScreen>(InitialListScreen);
  const [formScreen, setFormScreen] = useState<FormScreen>(InitialFormScreen);
  const [showScreen, setShowScreen] = useState<boolean>(false);

  const handleScreenConfirm = screen => {
    setShowScreen(false);

    setFormScreen(screen);
    setListScreen({ ...listScreen, page: 1 });

    fetchList({ ...screen, ...listScreen, page: 1 });
  };

  const handleReuseConfirm = useCallback(
    (id: number) => {
      dispatch({
        type: 'strategy/reusestrat',
        payload: { id, mode, listQuery: { ...listScreen, ...formScreen } },
      });
    },
    [mode, listScreen, formScreen],
  );

  const handleStopConfirm = useCallback((id: number) => {
    dispatch({
      type: 'strategy/stopstrat',
      payload: { id, mode, listQuery: { ...listScreen, ...formScreen } },
    });
  }, []);

  const handleCopyConfirm = useCallback(
    (id: number) => {
      dispatch({
        type: 'strategy/copystrat',
        payload: { id, mode },
        callback: () => history.push('/strategy/new'),
      });
    },
    [mode],
  );

  const handleDeleteConfirm = useCallback(
    (id: number) => {
      dispatch({
        type: 'strategy/deletestrat',
        payload: { id, mode, listQuery: { ...listScreen, ...formScreen } },
      });
    },
    [mode, listScreen, formScreen],
  );

  const handleTableChange: Required<TableProps<StrategyList>>['onChange'] = pager => {
    const page = pager.current || 1;
    const pageCount = pager.pageSize || 10;

    setListScreen({ page, pageCount });

    fetchList({ ...formScreen, page, pageCount });
  };

  const fetchList = (listQuery: StrategyScreen, callback?: (...args: any[]) => void) => {
    dispatch({
      type: 'strategy/fetchstratlist',
      payload: { query: listQuery, mode: modeContext.mode },
      callback: callback,
    });
  };

  const renderOperation = (_: any, record: StrategyList): React.ReactElement => {
    return (
      <div className="stratlist-list-operation">
        <YLink type="link" to={`${route.path}/${record[LIST_ID]}`}>
          查看
        </YLink>
        {/* {authes.includes(AUTH_STRAT_EDIT) ? ( */}
        <>
          {record[LIST_STATUS] === STATUS_UNABLE ? (
            <YModal
              type="func"
              label="启用"
              buttonProps={{ type: 'link' }}
              funcProps={{ title: '确定启用该策略', onOk: () => handleReuseConfirm(record[LIST_ID]) }}
            />
          ) : (
            <YModal
              type="func"
              label="停用"
              buttonProps={{ type: 'link' }}
              funcProps={{ title: '确定停用该策略', onOk: () => handleStopConfirm(record[LIST_ID]) }}
            />
          )}
          <YModal
            type="func"
            label="复制"
            buttonProps={{ type: 'link' }}
            funcProps={{ title: '确定复制该策略', onOk: () => handleCopyConfirm(record[LIST_ID]) }}
          />
          {record[LIST_STATUS] === STATUS_UNABLE ? (
            <YModal
              type="func"
              label="删除"
              buttonProps={{ type: 'link' }}
              funcProps={{ title: '确定删除该策略', onOk: () => handleDeleteConfirm(record[LIST_ID]) }}
            />
          ) : null}
        </>
        {/* ) : null} */}
      </div>
    );
  };

  const renderTime = (_: any, record: StrategyList): React.ReactElement => {
    return (
      <>
       <Tooltip title={record.create_timekey ? parseTimekey(Number(record.create_timekey)) : '--'}>
        <p className="formcontent">创建时间:{record.create_timekey ? parseTimekey(Number(record.create_timekey)) : '--'}</p>
       </Tooltip >
       <Tooltip title={record.update_timekey ? parseTimekey(Number(record.update_timekey)) : '--'}>
        <p className="formcontent">更新时间:{record.update_timekey ? parseTimekey(Number(record.update_timekey)) : '--'}</p>
       </Tooltip>
      </>
    )
  }

  const renderCardMsg = (_: any, record: StrategyList): React.ReactElement => {
    return (
      <>
        <Tooltip title={record.strat_title ? record.strat_title : '--'}>
          <p className="formcontent">卡片标题:{record.strat_title ? record.strat_title : '--'}</p>
        </Tooltip>
        <Tooltip title={record.strat_remark ? record.strat_remark : '--'}>
          <p className="formcontent">卡片说明:{record.strat_remark ? record.strat_remark : '--'}</p>
        </Tooltip>
      </>
    )
  }


  useEffect(() => {
    fetchList(listScreen);
  }, []);

  return (
    <div className="stratlist">
      <section className="stratlist-header">
        <h3>
          <YIcon type="bank" />
          <span>策略管理</span>
        </h3>
        <div className="stratlist-header-operation">
          <YModal
            type="drawer"
            label="筛选"
            showModal={showScreen}
            onShowModal={() => setShowScreen(true)}
            onCloseModal={() => setShowScreen(false)}
            content={<StratScreen form={form} onConfirm={handleScreenConfirm} />}
          />
          <YLink type="button" to={`${route.path}/feedback`}>
            新增负反馈
          </YLink>
          <YLink type="button" to={`${route.path}/new`}>
            新增
          </YLink>
        </div>
      </section>
      <Divider />
      <section>
        <Table<StrategyList>
          rowKey={LIST_ID}
          dataSource={stratList}
          pagination={{
            current: listScreen.page,
            pageSize: listScreen.pageCount,
            total: stratTotal,
            size: 'small',
            showSizeChanger: true,
          }}
          onChange={handleTableChange}
        >
          {StratListColumn.map(column => (
            <Table.Column key={column.key} {...column} />
          ))}
          <Table.Column<StrategyList> key="information" title="策略信息" width={240} render={renderCardMsg} />
          <Table.Column<StrategyList> key="time" title="时间" width={240} render={renderTime} />
          <Table.Column<StrategyList> key="operation" title="操作" width={180} render={renderOperation} />
        </Table>
      </section>
    </div>
  );
};

export default connect(({ strategy, user }: ConnectState) => ({ ...strategy, ...user }))(React.memo(StratList));
