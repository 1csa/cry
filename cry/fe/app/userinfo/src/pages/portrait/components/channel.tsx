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
      title: 'name',
      dataIndex: 'name',
    },
    {
      title: 'ID',
      dataIndex: 'keyname',
      render: text => <a href={"http://venus.yidianzixun.com:3082/channel/"+text} target="_blank">{text}</a>,
    },
    {
      title: 'group',
      dataIndex: 'groups',
      render: (text, record) => {
        return <div>
                  {record.groups[0] && <p>{record.groups[0]}</p>}
                  {record.groups[1] && <p>{record.groups[1]}</p>}
                  {record.groups[2] && <p>{record.groups[2]}</p>}
               </div>
      }
    },
    {
      title: 'clickDoc',
      dataIndex: 'clickDoc',
      sorter: (a, b) => a.clickDoc - b.clickDoc,
    },
    {
      title: 'ctr',
      dataIndex: 'ctr',
      sorter: (a, b) => a.ctr - b.ctr,
    },
    {
      title: 'dislike',
      dataIndex: 'dislike',
      sorter: (a, b) => a.dislike - b.dislike,
    },
    {
      title: 'dwell',
      dataIndex: 'dwell',
      sorter: (a, b) => a.dwell - b.dwell,
    },
    {
      title: 'score',
      dataIndex: 'score',
      sorter: (a, b) => a.score - b.score,
    },
    {
      title: 'viewDoc',
      dataIndex: 'viewDoc',
      sorter: (a, b) => a.viewDoc - b.viewDoc,
    },
  ];
  return <Table columns={columns} dataSource={props.channelForm} />;
}, areEqual);

export default SubChannel
