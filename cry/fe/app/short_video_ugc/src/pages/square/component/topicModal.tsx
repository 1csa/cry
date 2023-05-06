import React from 'react';
import {Modal} from 'antd';
import Topic from './topic';
interface TopicModalProps {
  children?: React.ReactNode,
  visible?: boolean
  onCancel?: (show: boolean) => void
  title?: string,
  topic?: TOPIC
}

const TopicModal: React.FC<TopicModalProps> = ({visible,onCancel,title, topic}) => {
  return (
    <>
      {visible?
        <Modal
          width={600}
          title={title}
          footer={null}
          visible={visible}
          onCancel={() => onCancel && onCancel(false)}
        >
          <Topic topic={topic} onCancel={onCancel}></Topic>
        </Modal> : null
      }
    </>
  );
}
export default TopicModal;
