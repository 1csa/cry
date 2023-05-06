import React, { useState } from 'react';
import { Divider } from 'antd';
import "./index.less";
import Search from '../topic/component/search';
import TopicCardList from '../square/component/topicCardList';
const Square: React.FC = () => {
  const [condition, setCondition] = useState<SEARCH_CONDITION>({});
  const [selectedTopic, setSelectedTopic] = useState<TOPIC>();
  const onSearch = (condition: SEARCH_CONDITION) => {
    setCondition({...condition});
  }

  const onTop = (topic: TOPIC) => {
    setSelectedTopic({...topic});
  }

  return (
    <>
      <div className="main-content">
        <div className="square-container">
          <div>
            <Search key="SquareSearch" onSearch={onSearch} noNeed={true}/>
            <Divider>
              <span style={{fontSize: '10px'}}>线上话题列表</span>
            </Divider>
            <TopicCardList
              key="effectiveTopics"
              type='effectiveTopics'
              condition={condition}
              onTop = {onTop}
            />
          </div>
          <div>
            <Divider>
              <span style={{fontSize: '10px', color: '#409177'}}>置顶话题列表</span>
            </Divider>
            <TopicCardList key="hotTopics" type='hotTopics' selectedTopic={selectedTopic}/>
          </div>
        </div>
      </div>
    </>
  );
}
export default Square;

