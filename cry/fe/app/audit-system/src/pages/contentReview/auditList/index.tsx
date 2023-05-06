import React from 'react';
import { Popover } from 'antd';

import AuditList from '@/pages/commonPages/list/index';

import { ContentType } from '@/data/constants';

const UserProfileAuditList: React.FC<{}> = () => {
  // 需要插入到form后面的表单json
  const filterFormModel = [
    {
      label: '审核员邮箱前缀',
      name: 'auditor_id',
      type: 'text',
      width: 350,
    },
  ];

  const userAvatarContent = (src: string) => {
    return <img style={{ width: '300px' }} src={src} alt="用户头像" />;
  };

  // 表格需要插入的列
  const tableColumns = [
    {
      title: '用户ID',
      dataIndex: 'user_id',
      key: 'user_id',
    },
    {
      title: '用户昵称',
      dataIndex: 'user_nick',
      key: 'user_nick',
    },
    {
      title: '头像',
      dataIndex: 'user_head_image_url',
      key: 'user_head_image_url',
      render: (src: string, record: any) => {
        return (
          <Popover placement="right" content={userAvatarContent(src)}>
            <img style={{ height: '40px' }} src={src} alt="用户头像" />
          </Popover>
        );
      },
    },
    {
      title: '个人简介',
      dataIndex: 'user_brief',
      key: 'user_brief',
    },
  ];

  // 类型
  const contentType: string = 'userprofile';

  return (
    <AuditList
      filterFormModel={filterFormModel}
      tableColumns={tableColumns}
      contentType={contentType}
      initialValues={{ material_type: [ContentType[contentType]], status: [3010] }}
    />
  );
};

export default UserProfileAuditList;
