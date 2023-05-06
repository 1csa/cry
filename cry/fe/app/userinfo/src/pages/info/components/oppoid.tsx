import React, {memo} from 'react';
import './fetchtable.less';

interface oppoProps {
  nickname: string;
  username: string;
  createTime: string;
  version: string;
  imei: string;
  utk: string;
  [propName: string]: any;
}

const areEqual = (prevProps:any, nextProps:any) => {
	return prevProps === nextProps
}
const OppoId = memo<oppoProps>(props => {
  const {nickname, username, createTime, version, imei, utk} = props.oppoForm;
  return <div className="fetchtable-item">
    <div className="info-item">
      <label>昵称：</label>
      <div>{nickname}</div>
    </div>
    <div className="info-item">
      <label>oppo_id：</label>
      <div>{username}</div>
    </div>
    <div className="info-item">
      <label>注册时间：</label>
      <div>{createTime}</div>
    </div>
    <div className="info-item">
      <label>首次登录版本：</label>
      <div>{version}</div>
    </div>
    <div className="info-item">
      <label>imei：</label>
      <div>{imei}</div>
    </div>
    <div className="info-item">
      <label>utk：</label>
      <div>{utk}</div>
    </div>
  </div>;
}, areEqual);

export default OppoId
