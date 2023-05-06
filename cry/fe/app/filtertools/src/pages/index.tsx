import React from 'react';
import { Card } from 'antd';
import {connect} from 'dva';
import {ConnectState, UserModelState} from '@/models/connect';
import './index.less';

interface IndexProps {
  user: UserModelState
}
const Index: React.FC<IndexProps> = ({user}) => {
  const {currentUser = {name:'管理员'}} = user || {};
  return (
    <>
      <div className="main-content">
        <Card bordered={false} style={{ minHeight: 380 }}>
          <div className="index-welcome">
            Hi, <span style={{color: '#40a9ff'}}> {currentUser.name} </span>,
            welcome to use filter tool!
          </div>
        </Card>
      </div>
    </>
  );
}

export default connect(({user}: ConnectState)=>({
  user
}))(Index);
