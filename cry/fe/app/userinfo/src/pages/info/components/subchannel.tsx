import React, {memo} from 'react';
import { Table } from 'antd';

interface channelProps {
  subChannelForm: Array<any>;
}
const areEqual = (prevProps:any, nextProps:any) => {
	return prevProps === nextProps
}
const SubChannel = memo<channelProps>(props => {
  const columns = [
    {
      title: 'type',
      dataIndex: 'type',
    },
    {
      title: 'name',
      dataIndex: 'name',
    },
    {
      title: 'fromId',
      dataIndex: 'fromId',
    },
    {
      title: 'createTime',
      dataIndex: 'createTime',
    },
    {
      title: 'updateTime',
      dataIndex: 'updateTime',
    },
  ];
  return <Table columns={columns} dataSource={props.subChannelForm} />;
}, areEqual);

export default SubChannel
