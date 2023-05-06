import React, { useEffect } from 'react';
import { message } from 'antd';
import { connect } from 'dva';

import { ConnectState, Dispatch, UserModelState, CommonModelState } from '@/types/connect';

import Authority from './authority';
import AppLayout from './layout';

interface LayoutProps extends UserModelState, CommonModelState {
  dispatch: Dispatch;
  children?: React.ReactNode;
}

const LayoutComponent: React.FC<LayoutProps> = ({ dispatch, authes, children, message: info, ...userProps }) => {
  // 如何去保证只在触发的时候去显示信息
  useEffect(() => {
    if (!info) {
      return;
    }
    message[info.type](info.message);

    dispatch({
      type: "common/resetmes",
      payload: {}
    })
  }, [info]);

  return (
    <Authority dispatch={dispatch} authes={[]} {...userProps} status="AUTH">
      <AppLayout authes={authes}>{children}</AppLayout>
    </Authority>
  );
};

export default connect(({ user, common }: ConnectState) => ({
  ...user, ...common
}))(LayoutComponent);
