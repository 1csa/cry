/**
 * 登录验证模块：
 * 未登陆未验证 => loading等待验证
 * 未登陆已验证 => 跳转登陆页
 * 已登陆无权限 => 提示未有权限并跳转pandora首页
 * 已登陆有权限 => render children
 * 权限验证不需要监听debug_mode的变化,暂时用来调试代码
 */

/**
 * 初始加载的时候去获取auth的信息，然后将其放至于context当中，供全局使用===> 是否没必要再去做store的存储？好像是可以没必要的？
 * 因为auth的获取只有一次，所以是不会触发频繁的更新
 */

import React, { useEffect } from 'react';
import { Spin } from 'antd';

import { Dispatch, UserModelState } from '@/types/connect';
import { USER_AUTH } from '@/constants/action';
import { useModeContext, AuthProvider } from '@/hooks';

import './index.less';

const PANDORA_LOGIN = '//pandora.yidian-inc.com/tools/admin/login';
const PANDORA_HOME = '//pandora.yidian-inc.com/tools/admin/home';

const Login: React.FC = () => {
  useEffect(() => {
    location.href = `${PANDORA_LOGIN}?callback=${location.href}`; // 这里的callback跳转没有成功
  }, []);

  return null;
};

const ToAuthority: React.FC = () => (
  <div className="page-info">
    您没有该工具的权限
    <a href={PANDORA_HOME}>点击此处</a>
    跳转pandora申请
  </div>
);

interface AuthorityProps extends UserModelState {
  children?: React.ReactNode;
  dispatch: Dispatch;
}

const Authority: React.FC<AuthorityProps> = ({ authes, children, status, dispatch }) => {
  const { mode } = useModeContext();

  useEffect(() => {
    dispatch({
      type: USER_AUTH,
      payload: { mode },
    });
  }, [mode]);

  return (
    <Spin wrapperClassName="page-body" spinning={status === 'UN_CHECK'}>
      <AuthProvider auth={authes}>
        {
          {
            UN_AUTH: <ToAuthority />,
            UN_LOGIN: <Login />,
            AUTH: children,
          }[status]
        }
      </AuthProvider>
    </Spin>
  );
};

export default React.memo(Authority);
