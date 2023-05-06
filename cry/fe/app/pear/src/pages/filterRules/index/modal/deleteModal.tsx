import React, { useState } from 'react';

import { Form, Modal, Tag } from 'antd';

const DetailModal = ({ form, row }: any) => {
  const [visible, setVisible] = useState<boolean>(false);
  const { getFieldDecorator } = form;
  const handleDetial = () => {
    setVisible(true);
  };
  const handleClose = () => {
    setVisible(false);
  };
  return (
    <>
      <Tag color="#108ee9" style={{ cursor: 'pointer' }} onClick={handleDetial}>
        删除
      </Tag>
      <Modal visible={visible} onCancel={handleClose}>
        <Form></Form>
      </Modal>
    </>
  );
};
export default Form.create()(DetailModal);
