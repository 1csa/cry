/**
 * 卡片列表
 */

import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouteMatch, useHistory } from 'react-router';
import { Table, Divider, Tooltip } from 'antd';
import { TableProps } from 'antd/es/table';
import { connect } from 'dva';

import { CardScreenForm } from '@/pages/cards/forms';
import { useModeContext } from '@/hooks';
import { YIcon, YLink, YModal } from '@/components';
import { CardListColumn, LIST_ID, STATUS_UNABLE, LIST_STATUS, defaultScreen } from '@/config/card.config';
import { CardList, FormScreen, ListScreen, CardScreen } from '@/types/card';
import { ConnectState, CardModelState, Dispatch } from '@/types/connect';
import { parseRecord, parseTimekey } from '@/utils';
import { defaultCards } from '@/config/card.config';
import './index.less';

const InitListScreen: ListScreen = { page: 1, pageCount: 10 };
const InitFormScreen: FormScreen = {};

interface InfocardList extends CardModelState {
  dispatch: Dispatch;
}

const InfocardList: React.FC<InfocardList> = ({ dispatch, cardlist, cardTotal }) => {
  const route = useRouteMatch();
  const history = useHistory();
  const modeContext = useModeContext();
  const form = useForm<FormScreen>({ defaultValues: defaultScreen });

  const mode = modeContext.mode;

  const [listLoading, setListLoading] = useState<boolean>(false);
  const [listScreen, setListScreen] = useState<ListScreen>(InitListScreen);
  const [formScreen, setFormScreen] = useState<FormScreen>(InitFormScreen);
  const [showScreen, setShowScreen] = useState<boolean>(false);

  // 获取数据时带上card
  const handleScreenConfirm = screen => {
    const screenData = parseRecord(screen);

    setShowScreen(false);
    setFormScreen(screenData);
    setListScreen({ ...listScreen, page: 1 });

    fetchList({ ...screenData, ...listScreen, page: 1 });
  };

  const handleReuseConfirm = useCallback(
    (id: number) => {
      dispatch({
        type: 'card/reusecard',
        payload: { id, mode, listQuery: { ...listScreen, ...formScreen } },
      });
    },
    [mode, listScreen, formScreen],
  );

  const handleStopConfirm = useCallback(
    (id: number) => {
      dispatch({
        type: 'card/stopcard',
        payload: { id, mode, listQuery: { ...listScreen, ...formScreen } },
      });
    },
    [mode, listScreen, formScreen],
  );

  const handleCopyConfirm = useCallback(
    (id: number) => {
      dispatch({
        type: 'card/copycard',
        payload: { card_id: id, mode },
        callback: () => history.push('/card/new'),
      });
    },
    [mode, listScreen, formScreen],
  );

  const handleDeleteConfirm = useCallback(
    (id: number) => {
      dispatch({
        type: 'card/deletecard',
        payload: { id, mode, listQuery: { ...listScreen, ...formScreen } },
      });
    },
    [listScreen, formScreen, mode],
  );

  const handleTableChange: Required<TableProps<CardList>>['onChange'] = pager => {
    const page = pager.current || 1;
    const pageCount = pager.pageSize || 10;

    setListScreen({ page, pageCount });
    fetchList({ ...formScreen, page, pageCount });
  };

  const fetchList = (query: CardScreen) => {
    setListLoading(true);

    dispatch({
      type: 'card/fetchlist',
      payload: { query: query, mode: modeContext.mode },
      callback: () => setListLoading(false),
    });
  };

  useEffect(() => {
    fetchList(listScreen);
    // 回到页面的时候把cardstore改为默认值 防止点击查看取到旧的model值
    dispatch({
      type: 'card/updatecard',
      payload: { card: defaultCards }
    })
  }, []);

  const renderOperation = (_: any, record: CardList): React.ReactElement => {
    return (
      <div className="cardlist-list-operation">
        <YLink type="link" to={`${route.path}/${record[LIST_ID]}`}>
          查看
        </YLink>
        {record[LIST_STATUS] === STATUS_UNABLE ? (
          <YModal
            type="func"
            label="启用"
            funcProps={{ title: '确定启用该卡片?', onOk: () => handleReuseConfirm(record[LIST_ID]) }}
            buttonProps={{ type: 'link' }}
          />
        ) : (
          <YModal
            type="func"
            label="停用"
            buttonProps={{ type: 'link' }}
            funcProps={{
              title: '确定停用该卡片?',
              content: '请仔细检查，停用该卡片将同步停止该卡片关联的投放',
              onOk: () => handleStopConfirm(record[LIST_ID]),
            }}
          />
        )}
        <YModal
          type="func"
          label="复制"
          buttonProps={{ type: 'link' }}
          funcProps={{ title: '确定复制该卡片?', onOk: () => handleCopyConfirm(record[LIST_ID]) }}
        />
        {record[LIST_STATUS] === STATUS_UNABLE ? (
          <YModal
            type="func"
            label="删除"
            buttonProps={{ type: 'link' }}
            funcProps={{ title: '确定删除该卡片', onOk: () => handleDeleteConfirm(record[LIST_ID]) }}
          />
        ) : null}
      </div>
    );
  };

  const renderTime = (_: any, record: CardList): React.ReactElement => {
    return (
      <>
        <Tooltip title={record.create_timekey ? parseTimekey(Number(record.create_timekey)) : '--'}>
          <p className="formcontent">创建时间:{record.create_timekey ? parseTimekey(Number(record.create_timekey)) : '--'}</p>
        </Tooltip>
        <Tooltip title={record.update_timekey ? parseTimekey(Number(record.update_timekey)) : '--'}>
          <p className="formcontent">更新时间:{record.update_timekey ? parseTimekey(Number(record.update_timekey)) : '--'}</p>
        </Tooltip>
      </>
    )
  }

  const renderCardMsg = (_: any, record: CardList): React.ReactElement => {
    return (
      <>
        <Tooltip title={record.card_title ? record.card_title : '--'}>
          <p className="formcontent">卡片标题:{record.card_title ? record.card_title : '--'}</p>
        </Tooltip>
        <Tooltip title={record.card_remark ? record.card_remark : '--'}>
          <p className="formcontent">卡片说明:{record.card_remark ? record.card_remark : '--'}</p>
        </Tooltip>
      </>
    )
  }

  return (
    <div className="cardlist">
      <section className="cardlist-header">
        <h3>
          <YIcon type="bank" />
          <span>卡片管理</span>
        </h3>
        <div className="cardlist-header-operation">
          <YModal
            type="drawer"
            label="筛选"
            content={<CardScreenForm form={form} onConfirm={handleScreenConfirm} />}
            showModal={showScreen}
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
        <Table<CardList>
          rowKey={LIST_ID}
          dataSource={cardlist}
          loading={listLoading}
          pagination={{
            size: 'small',
            total: cardTotal,
            showSizeChanger: true,
            current: listScreen.page,
            pageSize: listScreen.pageCount,
          }}
          onChange={handleTableChange}
        >
          {CardListColumn.map(column => (
            <Table.Column key={column.key} {...column} />
          ))}
          <Table.Column<CardList> key="information" title="卡片信息" width={240} ellipsis={true} render={renderCardMsg} />
          <Table.Column<CardList> key="time" title="时间" width={240} ellipsis={true} render={renderTime} />
          <Table.Column<CardList> key="operation" title="操作" width={180} render={renderOperation} />
        </Table>
      </section>
    </div>
  );
};

export default connect(({ user, card }: ConnectState) => {
  return { ...card, ...user };
})(React.memo(InfocardList));
