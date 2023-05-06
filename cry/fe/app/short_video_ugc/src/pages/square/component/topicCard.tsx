import React, {useState} from 'react';
import {Row, Col, Button, Divider, InputNumber} from 'antd';
import TopicModal from './topicModal';
import { Link } from 'react-router-dom';
interface TopicCardProps{
  children?: React.ReactNode
  topic: TOPIC
  onTop?: () => void
  onSort?: (index: number) => void
  onDelete?: () => void
}
const TopicCard: React.FC<TopicCardProps> = ({topic,  onTop, onSort, onDelete}) => {
  // hooks区域
  const [showTopicModal, setShowTopicModal] = useState<boolean>(false);
  const _onTop = () => {
    onTop && onTop();
  }
  const _onSort = (e: any) => {
    onSort && onSort(e.target.value - 1);
  }
  const _onDelete = () => {
    onDelete && onDelete();
  }

  return (
    <>
      <Row>
        <Link to={`/article?id=${topic.id}&name=${topic.name}`}>{topic.name}</Link>
      </Row>
      <Row gutter={10} style={{marginTop: 3}}>
        <Col span={7}>话题id: {topic.id}</Col>
        <Col span={12}>更新时间: {topic.update_time}</Col>
        <Col span={5}>类容数量: {topic.content_num}</Col>
      </Row>
      <Row style={{marginTop: 3}}>
        {onSort ? <InputNumber
          size="small"
          style={{width: 50, marginRight: '5px'}}
          min={1}
          onPressEnter = {_onSort}
        /> : null}
        {onTop ? <Button
            size="small"
            onClick={_onTop}
            style={{marginRight: '5px'}}
          >置顶</Button> : null}
        {onDelete ? <Button
          size="small"
          onClick={_onDelete}
          style={{marginRight: '5px'}}
        >删除</Button> : null}
        <Button size="small" onClick={() => setShowTopicModal(true)}>编辑话题</Button>
      </Row>
      <Divider dashed></Divider>
      <TopicModal
        title="编辑话题"
        visible={showTopicModal}
        onCancel={setShowTopicModal}
        topic={topic}
      />
    </>
  );
}

export default TopicCard;
