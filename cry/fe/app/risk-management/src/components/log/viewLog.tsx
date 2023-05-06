import React, { FC } from 'react';
import { 
  Modal,
  List,
  Icon,
  Tag,
} from 'antd';


interface AddCoverFormProps {
  modalvisible: boolean;
  setModalvisible?: (param: string) => void;
  useridLog: Array;
  useridRecord: Object;
}


const viewLog: FC<AddCoverFormProps> = (props: AddCoverFormProps) => {
  const {
    modalvisible,
    setModalvisible,
    useridLog,
    useridRecord,
  } = props;

  const closeModal = () => {
    setModalvisible(false);
  }
  return (
    <>
      <Modal
        title={<div><Icon type="alert"/> 拉黑日志</div>}
        visible={modalvisible}
        onCancel={closeModal}
        footer={null}
        width={700}
      >
        <p>userid: {useridRecord.userId}</p>
        <p>当前状态：{useridRecord.type === '黑名单' ? <Tag color="volcano">{useridRecord.type}</Tag>:<Tag color="green">{useridRecord.type}</Tag>}</p>
        <List
          size="small"
          header={<div>日志记录：</div>}
          bordered={true}
          dataSource={useridLog}
          renderItem={item => <List.Item>{item.blackLog}</List.Item>}
        />
      </Modal>
    </>
  );
}
export default viewLog;
