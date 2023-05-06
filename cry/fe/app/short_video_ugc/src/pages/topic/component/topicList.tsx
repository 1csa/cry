import React, {useEffect, useState, useCallback} from 'react';
import {Table, Divider, message, Spin, Button} from 'antd';
import { connect } from 'dva';
import { Dispatch, UserModelState } from '@/models/connect';
import { TopicState }  from '../models/topic';
import {topicFilter, getUserName} from '@/utils/dev_helper';
import TopicModal from './topicModal';
interface TopicListProps {
  children?: React.ReactNode,
  condition?: SEARCH_CONDITION,
  dispatch: Dispatch,
  user: UserModelState
  topicState: TopicState
  location: any
}

const TopicList: React.FC<TopicListProps> = ({condition, dispatch, topicState, user}) => {
  const {isDirty} = topicState;
  const columns = [{
    title: '话题id',
    dataIndex: 'id',
    key: 'id'
  },{
    title: '话题名称',
    dataIndex: 'name',
    key: 'name'
  },{
    title: '创建者',
    dataIndex: 'creator',
    key: 'creator'
  },{
    title: '创建时间',
    dataIndex: 'add_time',
    key: 'add_time'
  },{
    title: '类容数量',
    dataIndex: 'content_num',
    key: 'content_num'
  },{
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (text: any, record: any) => (
      record.status === 1?
        <span style={{color: '#339933'}}>上线</span>:
        <span style={{color: 'red'}}>下线</span>
    ),
  },
  // {
  //   title: '城市限制',
  //   dataIndex: 'city',
  //   key: 'city'
  // },
  {
    title: '相关操作',
    dataIndex: 'action',
    key: 'action',
    render: (text: any, record: any) => (
      <span>
        <Button onClick={() => onStatusClick(record)} size="small" type="danger">{record.status === 1? '下线': '上线'}</Button>
        <Divider type="vertical" />
        <Button onClick={() => onEditTopic(record)} size="small">编辑</Button >
        {/* <Divider type="vertical" />
        <a>Delete</a> */}
      </span>
    ),
  }];
  // hooks 区
  const [loading, setLoading] = useState<boolean>(false);
  const [topics, setTopics] = useState<TOPIC[]>([]);
  const [showTopicModal, setShowTopicModal] = useState<boolean>(false);
  const [editTopic, setEditTopic] = useState<TOPIC>();
  useEffect(() => {
    if(isDirty){
      getTopicList();
    }
  }, [isDirty]);

  useEffect(()=> { // 初次加载
    getTopicList();
  }, [])

  const getTopicList = useCallback(async () => {
    const {status, reason, result} = await dispatch({type: 'topic/fetchTopic'})
    setLoading(true);
    if(status === 'failed'){
      message.error(reason);
    }
    if(status === 'success'){
      const {list} = result;
      if(list.length){
        setTopics([...list]);
      }
    }
    setLoading(false);
  }, []);
  const onStatusClick = async (topic: TOPIC) => {
    const opticStatus = topic.status == 1? 2: 1;
    setLoading(true);
    const {status, reason} = await dispatch({
      type: 'topic/changeTopicStatus',
      payload: {
        id: topic.id,
        status: opticStatus,
        operator: getUserName(user),
      }
    });
    if(status === 'success'){
      message.success("操作成功!");
    } else {
      message.error(`操作失败!, ${reason}`);
    }
    setLoading(false);
  }
  const onEditTopic = (topic: TOPIC) => {
    setShowTopicModal(true);
    setEditTopic({...topic});
  }
  return (
    <>
      <Spin spinning={loading} tip="加载中...">
        <Table columns={columns} dataSource={topicFilter(topics, condition!)} rowKey="id"/>
        <TopicModal
          title="编辑话题"
          visible={showTopicModal}
          onCancel={setShowTopicModal}
          topic={editTopic}
        />
      </Spin>
    </>
  )
}

export default connect(({topic: topicState, user}: any) => ({
  topicState,
  user
}))(TopicList);
