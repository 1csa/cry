import React from 'react';
import BasicAuditList, { InitialValues } from '@/pages/commonPages/list/index';
import BasicCopyToClipboard from '@/components/Dumb/CopyToClipboard';

interface ArticleTypes {
  contentType: string;
  routePath: string;
  initialValues: Record<InitialValues, Array<number>>;
}

const PicArticleAuditList: React.FC<ArticleTypes> = ({ contentType, routePath, initialValues }) => {
  const routePathUrl = routePath ? routePath : `/pictureArticleReview/mediaContentReview`;

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
      label: 'docid',
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
      title: 'docid',
      dataIndex: 'docid',
      key: 'docid',
      render: (text: string) => copyFn(text, 'docid'),
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (title: string) => copyFn(title, '标题'),
    },
  ];

  // businessType类型如果有参数传入，则用参数-video否则就是article

  return (
    <BasicAuditList
      tableColumns={tableColumns}
      contentType={contentType || 'article'}
      filterFormModel={filterFormModel}
      routePathUrl={routePathUrl}
      initialValues={initialValues ? initialValues : { material_type: [102], status: [3010] }}
    />
  );
};

export default PicArticleAuditList;
