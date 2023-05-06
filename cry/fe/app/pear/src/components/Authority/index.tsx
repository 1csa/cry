// 登录验证模块：
// 已登录 => render children
// 未登录且验证未完成 => Loading 等待验证
// 未登录且验证完成 => 去 pandora 平台登录

import React, { useEffect } from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import { ConnectState, Dispatch, UserModelState } from '@/models/connect';

import './index.less';

interface AuthorityProps {
  children?: React.ReactNode;
  user: UserModelState;
  dispatch: Dispatch;
}

interface AuthorityState {
  isAuthing: boolean;
}

const login = () => {
  const loginUrl = '//pandora.yidian-inc.com/tools/admin/login';
  const cbUrl = location.href;
  location.href = `${loginUrl}?callback=${cbUrl}`;
};

const Authority: React.FC<AuthorityProps> = ({ children, user, dispatch }) => {
  const { currentUser } = user;
  const isAuthing = currentUser && currentUser.isAuthing;
  const isLogin = currentUser && currentUser.email;
  const needLogin = !isLogin && !isAuthing;
  localStorage.setItem("user" , isLogin)
  useEffect(() => {
    dispatch({ type: 'user/fetchCurrent' });

  }, []);


  return (
    <>
      {isLogin ? (
        children
      ) : needLogin ? (
        login()
      ) : (
        <div className="page-loading">
          <Spin size="large" spinning={isAuthing} />
        </div>
      )}
    </>
  );
};

export default connect(({ user }: ConnectState) => ({
  user,
}))(Authority);
