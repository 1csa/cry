import React, { useEffect, useState } from 'react';
import { Button, message, Spin } from 'antd';
import { connect } from 'dva';
import { Dispatch } from '@/models/connect';
import { isTopicExists, topicFilter } from '@/utils/dev_helper';
import {SquareTopicState} from '../models/topic';
import TopicCard from './topicCard';
import "../index.less";
interface TopicCardListProps{
  children?: React.ReactNode
  dispatch: Dispatch
  squareTopicState: SquareTopicState
  type: string
  selectedTopic?: TOPIC
  onTop: (topic: TOPIC) => void
  condition?: SEARCH_CONDITION
}

const URL_DIC = {
  'effectiveTopics': 'squareTopic/fetchEffectiveTopic',
  'hotTopics': 'squareTopic/fetchTopTopics'
}

const TopicCardList: React.FC<TopicCardListProps> = ({
  type,
  dispatch,
  squareTopicState,
  selectedTopic,
  onTop,
  condition
}) => {
  // 初始值
  const { isDirty } = squareTopicState;
  // hooks区
  const [topics, setTopics] = useState<TOPIC[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  useEffect(()=>{
    if(isDirty){
      getEffectiveTopics();
    }
  }, [isDirty]);
  useEffect(()=>{
    getEffectiveTopics();
  }, []);
  useEffect(()=>{
    if(selectedTopic){
      if(type === 'hotTopics' && !isTopicExists(topics, selectedTopic)){
        topics.unshift(selectedTopic);
        setTopics([...topics]);
      } else {
        message.info("当前话题已存在置顶列表中!");
      }
    }
  },[selectedTopic]);

  // callback区
  const getEffectiveTopics = async () => {
    const {status, reason, result} = await dispatch({type: URL_DIC[type]})
    setLoading(true);
    if(status === 'failed'){
      message.error(reason);
    }
    if(status === 'success'){
      let list = result;
      if(type === 'effectiveTopics'){
        list = result.list;
      }
      if(list && list.length){
        setTopics([...list]);
      }
    }
    setLoading(false);
  }
  // events区
  const _onTop = (topic: TOPIC)=> {
    onTop && onTop(topic);
  }
  const _onDelete = (index: number) => {
    topics.splice(index, 1);
    setTopics([...topics]);
  }
  const _onSort = (from: number, to: number) => {
    const topic = topics.splice(from, 1);
    if(to <= topics.length){
      topics.splice(to, 0, ...topic)
      setTopics([...topics]);
    } else {
      message.error(`${to}大于列表长度`);
    }
  }
  const onSaveHotTopic = async () => {
    setSaveLoading(true);
    const {status, reason} = await dispatch({
      type: 'squareTopic/saveHotTopic',
      payload: topics.map((topic: TOPIC) => topic.id)
    });
    if(status === 'success'){
      message.success('操作成功!');
    } else {
      message.error(`保存失败, ${reason}`);
    }
    setSaveLoading(false);
  }
  const filterTopics = () => {
    let tempTopics = topics;
    if(condition){
      tempTopics = topicFilter(topics, condition);
    }
    return tempTopics;
  }
  return (
    <>
      <Spin spinning={loading} tip={'加载中...'} wrapperClassName="spin-container">
        <div style={{marginBottom: '50px'}}>
          {topics && filterTopics().map((topic: TOPIC, index: number) => {
              if(type === 'hotTopics'){
                return <TopicCard
                  topic = {topic}
                  key = {index}
                  onDelete={()=>_onDelete(index)}
                  onSort = {(to: number) => _onSort(index, to)}
                />
              } else {
                return <TopicCard
                  topic = {topic}
                  key = {index}
                  onTop = {()=>_onTop(topic)}
                />
              }
            }
          )}
        </div>
        {
          topics.length && type === 'hotTopics'? <div
            className="save-btn"
          >
            <Button
              type="primary"
              style = {{width: '100%'}}
              onClick = {() => onSaveHotTopic()}
              loading = {saveLoading}
              disabled={saveLoading}
            >
              保存
            </Button>
          </div>
          : null
        }
      </Spin>
    </>
  );
}

export default connect(({squareTopic: squareTopicState}: any)=>({
  squareTopicState
}))(TopicCardList);
