import React, {memo} from 'react';
import { Table } from 'antd';

interface channelProps {
  categoryInfo: Array<any>;
}
const areEqual = (prevProps:any, nextProps:any) => {
	return prevProps === nextProps
}
const Category = memo<channelProps>(props => {
  const columns = [
    {
      title: 'name',
      dataIndex: 'keyname',
    },
    {
      title: 'clickDoc',
      dataIndex: 'clickDoc',
    },
    {
      title: 'ctr',
      dataIndex: 'ctr',
    },
    {
      title: 'dislike',
      dataIndex: 'dislike',
    },
    {
      title: 'dwell',
      dataIndex: 'dwell',
    },
    {
      title: 'score',
      dataIndex: 'score',
    },
    {
      title: 'viewDoc',
      dataIndex: 'viewDoc',
    },
  ];
  return <Table columns={columns} dataSource={props.categoryInfo} />;
}, areEqual);

export default Category
