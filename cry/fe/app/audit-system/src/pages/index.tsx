import React from 'react';
import { connect } from 'dva';
import { Card } from 'antd';

import { ConnectState, UserModelState } from '@/models/connect';

import './index.less';

interface GlobalHeaderProps {
  user: UserModelState;
}

const Home: React.FC<GlobalHeaderProps> = props => {
  const { currentUser = {} } = props.user;

  return (
    <>
      <div className="main-content">
        <Card bordered={false} className="index-card">
          欢迎 {currentUser.name} 使用审核工具
        </Card>
      </div>
    </>
  );
};

export default connect(({ user }: ConnectState) => ({
  user,
}))(Home);
