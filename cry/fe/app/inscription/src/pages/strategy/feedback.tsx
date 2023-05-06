/**
 * 负反馈策略表单：产品想把表单和列表放一起，虽然有点奇怪，但是也不是不可以
 */

import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { Divider, Table, Card } from 'antd';
import { ColumnType, TableProps } from 'antd/es/table';
import { connect } from 'dva';

import { YModal } from '@/components';
import { AUTH_FEEDBACK_EDIT } from '@/config/app.config';
import { FeedbackListColumn, LIST_FEEDBACK_ID, LIST_FEEDBACK_NAME, defaultFeedbacks } from '@/config/strat.config';
import { useModeContext } from '@/hooks';
import { FeedbackList, ListScreen, FeedbackForm } from '@/types/strat';
import { ConnectState, StratModelState, Dispatch, UserModelState } from '@/types/connect';
import { StratFeedback } from '@/pages/strategy/forms';

interface Feedback extends StratModelState, UserModelState {
  dispatch: Dispatch;
}

const InitialListScreen = { page: 1, pageCount: 9999 };

const Feedback: React.FC<Feedback> = React.memo(({ dispatch, authes, feedbackList, feedbackTotal }) => {
  const modeContext = useModeContext();
  const authed = useMemo(() => authes.includes(AUTH_FEEDBACK_EDIT), [authes]);

  const [listScreen, setListScreen] = useState<ListScreen>(InitialListScreen);
  const [feedbackItem, setFeedbackItem] = useState<FeedbackForm>(defaultFeedbacks);

  const mode = modeContext.mode;

  const handleFbConmit = useCallback(
    (feedback: FeedbackForm, isnew: boolean) => {
      dispatch({
        type: 'strategy/postfeedback',
        payload: { feedback, mode, isnew, listQuery: listScreen },
      });
    },
    [mode, listScreen],
  );

  const handleCheckClick = useCallback((record: FeedbackList) => {
    const {
      feedback_id,
      feedback_name,
      feedback_forbidden_days,
      feedback_downright,
      feedback_downright_count,
      feedback_downright_days,
    } = record;
    setFeedbackItem({
      feedback_id,
      feedback_name,
      feedback_forbidden_days,
      feedback_downright,
      feedback_downright_count,
      feedback_downright_days,
    });
  }, []);

  const handleDeleteConfirm = useCallback(
    (feedback_id: number) => {
      dispatch({
        type: 'strategy/deletefeedback',
        payload: { feedback_id, mode, query: listScreen },
      });
    },
    [mode, listScreen],
  );

  const handleTableChange: Required<TableProps<FeedbackList>>['onChange'] = useCallback(pager => {
    const page = pager.current || 1;
    const pageCount = pager.pageSize || 9999;

    setListScreen({ page, pageCount });
  }, []);

  const operation: ColumnType<FeedbackList> = {
    dataIndex: 'operation',
    key: 'operation',
    title: '操作',
    render: (_, record) => (
      <>
        <YModal
          type="modal"
          label="查 看"
          showModal={feedbackItem.feedback_id === record.feedback_id}
          buttonProps={{ type: 'link' }}
          modalProps={{ title: record[LIST_FEEDBACK_NAME], destroyOnClose: true }}
          content={<StratFeedback edit={false} authed={authed} onCommit={handleFbConmit} feedback={feedbackItem} />}
          onShowModal={() => handleCheckClick(record)}
          onCloseModal={() => setFeedbackItem(defaultFeedbacks)}
        />
        <YModal
          type="func"
          label="删 除"
          funcProps={{ title: '确定删除该负反馈策略?', onOk: () => handleDeleteConfirm(record[LIST_FEEDBACK_ID]!) }}
          buttonProps={{ type: 'link' }}
        />
      </>
    ),
  };

  useEffect(() => {
    dispatch({
      type: 'strategy/fetchfblist',
      payload: { mode, query: listScreen },
    });
  }, [mode, listScreen]);

  return (
    <div className="feedback">
      <h3>策略管理/负反馈策略</h3>
      <Card className="feedback-card">
        <h4>新建负反馈</h4>
        <StratFeedback edit={true} authed={authed} onCommit={handleFbConmit} />
      </Card>
      <Divider />
      <Card className="feedback-card">
        <h4>历史负反馈</h4>
        <Table
          rowKey={LIST_FEEDBACK_ID}
          columns={[...FeedbackListColumn, operation]}
          dataSource={feedbackList}
          pagination={{
            size: 'small',
            total: feedbackTotal,
            current: listScreen.page,
            pageSize: listScreen.pageCount,
          }}
          onChange={handleTableChange}
        />
      </Card>
    </div>
  );
});

export default connect(({ user, strategy }: ConnectState) => ({ ...user, ...strategy }))(React.memo(Feedback));
