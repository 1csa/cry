import React from 'react';
import AuditList from '@/pages/commonPages/list/index';
import BasicCopyToClipboard from '@/components/Dumb/CopyToClipboard';
import { ContentType } from '@/data/constants';

const ShortContentAuditList: React.FC<{}> = () => {
  const copyFn = (text: string, des: string) => {
    return (
      <BasicCopyToClipboard
        data={text}
        title={`${des}`}
        renderChild={() => <span style={{ cursor: 'pointer' }}>{text}</span>}
      />
    );
  };

  const filterFormModel = [
    {
      label: '评论id',
      name: 'docids',
      type: 'text',
    },
    {
      label: '审核员邮箱前缀',
      name: 'auditor_id',
      type: 'text',
      width: 350,
    },
  ];

  const tableColumns = [
    {
      title: '评论id',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => copyFn(text, '评论id'),
    },
    {
      title: 'docid',
      dataIndex: 'docId',
      key: 'docId',
      render: (text: string) => copyFn(text, 'docid'),
    },
    {
      title: '评论内容',
      dataIndex: 'comment',
      key: 'comment',
      width: 600,
    },
  ];

  const contentType: string = 'comment';

  return (
    <AuditList
      routePathUrl={`/shortContent/five`}
      filterFormModel={filterFormModel}
      tableColumns={tableColumns}
      contentType={contentType}
      initialValues={{ material_type: [ContentType[contentType]], status: [3010] }}
    />
  );
};

export default ShortContentAuditList;
