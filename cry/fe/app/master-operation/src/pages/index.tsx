import React from 'react';
import { Card } from 'antd';
import { connect } from 'dva';
import { ConnectState, UserModelState } from '@/models/connect';
import { getUserName } from '@/utils/dev_helper';
import './index.less';

interface WelcomeProps {
  children?: React.ReactNode;
  user: UserModelState;
}

const Welcome: React.FC<WelcomeProps> = ({ user }) => {
  return (
    <>
      <div className="main-content">
        <Card bordered={false} bodyStyle={{ height: '100%', position: 'relative' }}>
          <div className="welcome-container">
            欢迎&nbsp;
            <span>{getUserName(user)}</span>
            &nbsp;使用主端运营工具
          </div>
        </Card>
      </div>
    </>
  );
};

export default connect(({ user }: ConnectState) => ({
  user,
}))(Welcome);
