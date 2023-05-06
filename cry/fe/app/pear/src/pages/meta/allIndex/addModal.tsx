import React, { FC, useEffect, useState } from 'react';
import { Button, Card, Checkbox, Form, Input, message, Modal, Radio, Switch } from 'antd';

import { FormItemLayout } from '@/config/list.config';
interface addProps {
  form: any;
}
const { TextArea } = Input;
const AddModal: React.FC<addProps> = ({ form }) => {
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
      <Modal visible={visible} onCancel={handClose} onOk={handOk} width="40%">
        <Form {...FormItemLayout}>
          <Form.Item label="索引时效">
            {getFieldDecorator('a', {
              initialValue: '索引时效',
            })(<Input></Input>)}
          </Form.Item>
          <Form.Item label="账号后置过滤池">
            {getFieldDecorator('b', {
              initialValue: '账号后置过滤池',
            })(<TextArea rows={3}></TextArea>)}
          </Form.Item>
          <Form.Item label="内容映射scope过滤开关">
            {getFieldDecorator('c', {
              initialValue: '',
            })(<Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked />)}
          </Form.Item>
          <Form.Item label="文章去重">
            {getFieldDecorator('d', {
              initialValue: '',
            })(<Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked />)}
          </Form.Item>
          <Form.Item label="过滤前置">
            {getFieldDecorator('e', {
              initialValue: '',
            })(<Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked />)}
          </Form.Item>
          <Form.Item label="选点名单数据截取日期(天)">
            {getFieldDecorator('f', {
              initialValue: '',
            })(<TextArea rows={3}></TextArea>)}
          </Form.Item>
          <Form.Item label="文章来源">
            {getFieldDecorator('g', {
              initialValue: '',
            })(
              <Radio.Group>
                <Radio value={1}>ES当天表+ES全量表</Radio>
                <Radio value={2}>ES全量表</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          <Form.Item label="ES查询数量">
            <Form.Item label="当天表">
              {getFieldDecorator('ss', {
                initialValue: '',
              })(<Input style={{ width: 130 }}></Input>)}
            </Form.Item>
            <Form.Item label="全量表">
              {getFieldDecorator('sd', {
                initialValue: '',
              })(<Input style={{ width: 130 }}></Input>)}
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default AddModal;
