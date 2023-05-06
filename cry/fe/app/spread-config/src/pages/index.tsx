import React from 'react';
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
        <div className="index-welcome">
          welcome
          <span style={{color: '#00FFFF'}}> {currentUser.name} </span>
          to use!
        </div>
      </div>
    </>
  );
}

export default connect(({user}: ConnectState)=>({
  user
}))(Index);
