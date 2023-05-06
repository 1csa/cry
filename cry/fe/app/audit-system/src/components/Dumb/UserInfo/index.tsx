import React from 'react';
import { Popover } from 'antd';

import Image from '@/components/Dumb/Image';

import './index.less';
interface UserInfoProps {
  title: string;
  id: string | number;
  nickname: string;
  headImage: string;
  brief?: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ title, id, nickname, headImage, brief }) => {
  return (
    <div className="user-info">
      {title && <h3>{title}：</h3>}
      <div className="row">
        <span className="label">用户昵称：</span>
        {nickname}
      </div>
      <div className="row">
        <span className="label">用户id：</span>
        {id}
      </div>
      <div className="row avatar-wrapper">
        <span className="label">用户头像：</span>
        <Popover content={<img style={{ width: 300, height: 300, objectFit: 'contain' }} src={headImage} alt="头像" />} placement="left">
          <Image width={100} height={100} src={headImage} preview={false} />
        </Popover>
      </div>
      {brief && (
        <div className="row">
          <span className="label">用户简介：</span>
          {brief}
        </div>
      )}
    </div>
  );
};

export default React.memo(UserInfo);
