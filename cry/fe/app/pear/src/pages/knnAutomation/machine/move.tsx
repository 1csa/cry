import React, { useState } from 'react';

import { Modal, Button, Form, Popconfirm, message } from 'antd';

import Factor from './factor';

import { fetchFactorMove } from '@/services/knnAutomation';

interface MoveProps {
  form: any;
  host: string;
  factor: string;
  successCallback: () => void;
}

const MoveModal: React.FC<MoveProps> = ({ form, factor, host, successCallback }) => {
  const { getFieldDecorator } = form;
  const [visible, setVisible] = useState(false);

  const move = async ({ machineFactor }: any) => {
    const res = await fetchFactorMove({ machineFactor, host });
    if (res.success && typeof successCallback === 'function') {
      message.success('移动成功');
      toggleMove();
      successCallback();
    }
  };

  const toggleMove = () => {
    setVisible(!visible);
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    form.validateFields((err: any, values: any) => {
      if (!err) {
        move(values);
      }
    });
  };

  return (
    <>
      <Popconfirm title="是否要移动机器？" onConfirm={toggleMove}>
        <Button type="link">移动</Button>
      </Popconfirm>
      <Modal title={`移动机器${host}`} visible={visible} onOk={handleSubmit} onCancel={toggleMove}>
        <Form {...formItemLayout} onSubmit={handleSubmit}>
          <Factor defaultValue={factor} getFieldDecorator={getFieldDecorator} />
        </Form>
      </Modal>
    </>
  );
};

export default Form.create()(MoveModal);
