import React, {memo} from 'react';
import { Button } from 'antd';
import './fetchtable.less';

interface infoProps {
  userid: string;
  nickname: string;
  username: string;
  usertype: string;
  appid: string;
  createTime: string;
  distributionChannel: string
  version: string;
  fontsize: string;
  freshuser: boolean;
  readonly: boolean;
  [propName: string]: any
}

const areEqual = (prevProps:any, nextProps:any) => {
	return prevProps === nextProps
}
const FetchTable = memo<infoProps>(props => {
  const {userid, nickname, username, usertype, appid, createTime, distributionChannel, version, fontsize, freshuser, readonly, profile} = props.userForm;
  return <div className="fetchtable-item">
    <div className="info-item">
      <label>昵称：</label>
      <div>{nickname}</div>
    </div>
    <div className="info-item">
      <label>用户名：</label>
      <div>{username}</div>
    </div>
    <div className="info-item">
      <label>用户类型：</label>
      <div>{usertype}</div>
    </div>
    <div className="info-item">
      <label>使用的APP：</label>
      <div>{appid}</div>
    </div>
    <div className="info-item">
      <label>注册时间：</label>
      <div>{createTime}</div>
    </div>
    <div className="info-item">
      <label>用户渠道：</label>
      <div>{distributionChannel}</div>
    </div>
    <div className="info-item">
      <label>首次登录版本：</label>
      <div>{version}</div>
    </div>
    <div className="info-item">
      <label>设置的字体：</label>
      <div>{fontsize}</div>
    </div>
    <div className="info-item">
      <label>新用户：</label>
      <div>{freshuser ? '是':'否'}</div>
    </div>
    <div className="info-item">
      <label>只读用户：</label>
      <div>{readonly ? '是':'否'}</div>
    </div>
    <div className="info-item">
      <label>发表的评论：</label>
      <Button
        type="link"
        size="small"
        href={`http://pandora.yidian-inc.com/tools/crow#!/search/userid/${userid}/publish_review_pass`}
        target="_blank"
        style={{padding: '0'}}
      >去看看>></Button>
    </div>
    <div className="img-item">
      <img src={profile} width="122" height="122"/>
    </div>
  </div>;
}, areEqual);

export default FetchTable
