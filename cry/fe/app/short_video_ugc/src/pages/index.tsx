import React, {useEffect} from 'react';
import { Card } from 'antd';
import {connect} from 'dva';
import {ConnectState, UserModelState } from '@/models/connect';
import {getUserName} from '@/utils/dev_helper';
import './index.less';

interface HomeProps {
  children?: React.ReactNode,
  user: UserModelState
}

const Home: React.FC<HomeProps> = ({user}) => {
  // console.log(user, '-');
  return (
    <>
      <div className="main-content">
        <Card bordered={false} bodyStyle={{height: '100%',position: 'relative'}}>
          <div className="welcome-container">
            欢迎&nbsp;
            <span>{getUserName(user)}</span>
            &nbsp;使用小视频UGC活动管理工具
          </div>
        </Card>
      </div>
    </>
  );
}

export default connect(({user}: ConnectState)=>({
  user
}))(Home);
