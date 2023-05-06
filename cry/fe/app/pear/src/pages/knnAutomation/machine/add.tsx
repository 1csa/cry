// @ts-nocheck
import React, { useState } from 'react';
import { connect } from 'dva';
import { Modal, Button, Form, Select, Input, message } from 'antd';

import Factor from './factor';
import { factorType } from './config';

import { fetchFactorAdd } from '@/services/knnAutomation';

import { ConnectState } from '@/models/connect';
import UserPermissions from '@/utils/user_whitelist';
interface AddModalProps {
  form: any;
  successCallback: () => void;
}

const AddModal: React.FC<AddModalProps> = ({ form, successCallback, user }) => {
  const { getFieldDecorator } = form;
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const add = async (values: any) => {
    const { IPs, ...others } = values;
    const hosts: string[] = [];
    IPs.split('\n').forEach((item: string) => {
      const ip = item.trim();
      ip && hosts.push(item);
    });
    setLoading(true);
    const res = await fetchFactorAdd({
      ...others,
      hosts,
    });
    setLoading(false);
    if (res.success) {
      message.success('新增成功');
      toggleAdd();
      if (typeof successCallback === 'function') {
        successCallback();
      }
    }
  };

  const toggleAdd = () => {
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
    form.validateFields((err, values) => {
      if (!err) {
        add(values);
      }
    });
  };

  return (
    <>
      {UserPermissions(user.currentUser.name) ? (
        <Button style={{ margin: '0 10px' }} icon="plus" onClick={toggleAdd}>
          新增
        </Button>
      ) : (
        ''
      )}
      <Modal title="新增机器" visible={visible} onOk={handleSubmit} onCancel={toggleAdd} destroyOnClose confirmLoading={loading}>
        <Form {...formItemLayout} onSubmit={handleSubmit}>
          <Factor getFieldDecorator={getFieldDecorator} />
          <Form.Item label="机器类型">
            {getFieldDecorator('machineType', {
              initialValue: 'cpu',
              rules: [{ required: true }],
            })(
              <Select style={{ width: 230 }}>
                {factorType.map((item: any) => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.text}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="主机IP">
            {getFieldDecorator('IPs', {
              initialValue: '',
              rules: [{ required: true, message: '请输入主机IP' }],
            })(<Input.TextArea rows={5} placeholder="请输入主机IP，每行一个IP" style={{ width: 230 }} />)}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default connect(({ user }: ConnectState) => ({
  user,
}))(Form.create()(AddModal));
