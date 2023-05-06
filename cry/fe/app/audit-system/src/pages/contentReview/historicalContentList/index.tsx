import React from 'react';

import { Popover, Tooltip } from 'antd';

import BaseHisContentList from '@/pages/commonPages/baseHisContentList';

import { filterFormKey, replaceFormItem } from './viewmodel/formModel';

const contentType: string = 'userprofile';

const filterTableKey: string = 'docid,title';

const userAvatarContent = (src: string) => {
  return <img style={{ width: 300 }} src={src} alt="用户头像" />;
};

const replaceTableItem = [
  {
    title: 'userid',
    dataIndex: 'docid',
    key: 'docid',
  },
  {
    title: '昵称',
    dataIndex: ['material', 'user_nick'],
    key: 'user_nick',
  },
  {
    title: '简介',
    dataIndex: ['material', 'user_brief'],
    key: 'user_brief',
    render: (text: string) => {
      return (
        <div className="clamp3" style={{ WebkitBoxOrient: 'vertical' }}>
          <Tooltip title={text}>{text}</Tooltip>
        </div>
      );
    },
  },
  {
    title: '头像',
    dataIndex: ['material', 'user_head_image_url'],
    key: 'user_head_image_url',
    render: (src: string, record: any) => {
      return (
        <Popover placement="right" content={userAvatarContent(src)}>
          <img style={{ height: 40 }} src={src} alt="用户头像" />
        </Popover>
      );
    },
  },
];

const UserprofileHisList: React.FC<{}> = () => {
  return (
    <BaseHisContentList
      initialValues={{ material_type: [101] }}
      contentType={contentType}
      filterOptions={{
        filterFormKey,
        replaceFormItems: { index: -1, items: replaceFormItem },
        filterTableKey,
        replaceTableItems: { index: 0, items: replaceTableItem },
      }}
    />
  );
};

export default UserprofileHisList;
