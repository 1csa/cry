import React, { FC, useEffect, useState } from 'react';
import { Button, Card, Checkbox, Form, Input, message, Modal, Radio, Select, Switch } from 'antd';

import { FormItemLayout } from '@/config/list.config';
interface addProps {
  form: any;
}
const { TextArea } = Input;
const IndexAddModal: React.FC<addProps> = ({ form }) => {
  const [visible, setVisible] = useState<boolean>(false);

  const { getFieldDecorator } = form;
  const handClickAdd = () => {
    setVisible(!visible);
  };
  const handClose = () => {
    setVisible(!visible);
  };
  const handOk = (event: any) => {
    event.preventDefault();
    form.validateFields((err: any, values: any) => {
      if (!err) {
        console.log(values, 'wwwwww');
        setVisible(!visible);
      } else {
        // message.warning('创建失败')
      }
    });
  };
  return (
    <>
      <Button style={{ marginTop: 4, marginLeft: 20 }} type="primary" icon="search" onClick={handClickAdd}>
        创建
      </Button>
      <Modal visible={visible} onCancel={handClose} onOk={handOk}>
        <Form {...FormItemLayout}>
          <Form.Item label="一级索引：">
            {getFieldDecorator('a', {
              initialValue: 'B模型',
            })(
              <Select style={{ width: 80 }}>
                <Option value="loose">B模型</Option>
                <Option value="small">C模型</Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="二级索引：">
            {getFieldDecorator('b', {
              initialValue: 'B模型',
            })(
              <Select style={{ width: 80 }}>
                <Option value="loose">B模型</Option>
                <Option value="small">C模型</Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="ES查询条件：">
            {getFieldDecorator('c', {
              initialValue: '',
            })(<Input></Input>)}
          </Form.Item>
          <Form.Item label="ctype参数">
            {getFieldDecorator('d', {
              initialValue: '',
            })(<Input></Input>)}
          </Form.Item>
          <Form.Item label="打分模式：">
            {getFieldDecorator('e', {
              initialValue: 'B模型',
            })(
              <Select style={{ width: 80 }}>
                <Option value="loose">B模型</Option>
                <Option value="small">C模型</Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="ZK地址：">
            {getFieldDecorator('e', {
              initialValue: 'B模型',
            })(
              <Select style={{ width: 80 }}>
                <Option value="loose">B模型</Option>
                <Option value="small">C模型</Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="索引时效">
            {getFieldDecorator('c', {
              initialValue: '',
            })(<Input></Input>)}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default IndexAddModal;
