/**
 * 历史记录列表
 */
// TODO 操作日志的写入和读取，格式怎么定义

import React, { useCallback, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Table, Divider } from 'antd';
import { TableProps } from 'antd/es/table';
import { connect } from 'dva';

import { YIcon, YModal } from '@/components';
import { useModeContext } from '@/hooks';
import { HistoryColumnConfig, LIST_ID } from '@/config/history.config';
import { HistoryList, HistoryScreen, FormScreen, ListScreen } from '@/types/other';
import { Dispatch, ConnectState, OtherModelState } from '@/types/connect';
import { DebugMode } from '@/types/app';
import { HistoryScreenForm } from './screen';
import './index.less';

interface HistoryListType extends OtherModelState {
  dispatch: Dispatch;
}

const InitListScreen: ListScreen = { page: 1, pageCount: 10 };
const InitFormScreen: FormScreen = {};

// TODO: 如何来区分不同类型的卡片
const HistoryList: React.FC<HistoryListType> = ({ dispatch, historyTotal, historyList }) => {
  const form = useForm();
  const modeContext = useModeContext();

  const [listScreen, setListScreen] = useState<ListScreen>(InitListScreen);
  const [formScreen, setFormScreen] = useState<FormScreen>(InitFormScreen);
  const [showScreen, setShowScreen] = useState<boolean>(false);

  const handleScreenConfirm = screen => {
    setShowScreen(false);

    setFormScreen(screen);
    setListScreen({ ...listScreen, page: 1 });

    fetchList({ ...screen, ...listScreen, page: 1 });
  };

  const handleTableChange: Required<TableProps<HistoryList>>['onChange'] = pager => {
    const page = pager.current || 1;
    const pageCount = pager.pageSize || 10;

    setListScreen({ page, pageCount });
    fetchList({ ...formScreen, page, pageCount });
  };

  const fetchList = (query: HistoryScreen) => {
    dispatch({
      type: 'other/fetchhistory',
      payload: { query, mode: modeContext.mode },
    });
  };

  useEffect(() => {
    fetchList(listScreen);
  }, [])

  return (
    <div className="historylist">
      <section className="historylist-header">
        <h3>
          <YIcon type="bank" />
          <span>操作日志</span>
        </h3>
        <YModal
          type="drawer"
          label="筛选"
          showModal={showScreen}
          content={<HistoryScreenForm form={form} onConfirm={handleScreenConfirm} />}
          onShowModal={() => setShowScreen(true)}
          onCloseModal={() => setShowScreen(false)}
          buttonProps={{ type: 'primary' }}
        />
      </section>
      <Divider />
      <Table
        rowKey={LIST_ID}
        columns={HistoryColumnConfig}
        dataSource={historyList}
        pagination={{
          current: listScreen.page,
          pageSize: listScreen.pageCount,
          total: historyTotal,
          size: 'small',
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default connect(({ other }: ConnectState) => ({ ...other }))(React.memo(HistoryList));
