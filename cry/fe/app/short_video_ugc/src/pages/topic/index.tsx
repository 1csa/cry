import React, {useState} from 'react';
import { Card, Divider } from 'antd';
import Search from './component/search';
import TopicModal from './component/topicModal';
import TopicList from './component/topicList';
const Topic: React.FC = () => {
  const [showTopicModal, setShowTopicModal] = useState<boolean>(false);
  const [condition, setCondition] = useState<SEARCH_CONDITION>({});
  const onSearch = (condition: SEARCH_CONDITION) => {
    // console.log(condition);
    setCondition({...condition});
  }
  return (
    <>
      <div className="main-content">
        <Card bordered={false}>
          <Search onSearch={onSearch} onTopicClick={setShowTopicModal} key="topicSearch"></Search>
          <Divider>
            <span style={{fontSize: '10px'}}>主题列表</span>
          </Divider>
          <TopicList condition={condition}></TopicList>
          <TopicModal
            title="新增话题"
            visible={showTopicModal}
            onCancel={setShowTopicModal}
          />
        </Card>
      </div>
    </>
  );
}

export default Topic;
