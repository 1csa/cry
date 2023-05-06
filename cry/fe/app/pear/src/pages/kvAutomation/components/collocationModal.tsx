import React, { FC, useEffect, useState } from 'react';
import { Button, Card, Checkbox, Form, Input, message, Modal, Radio, Switch, Tag } from 'antd';

import { FormItemLayout } from '@/config/list.config';
import './index.less';
interface addProps {
  row: any;
  form: any;
  indexName: string;
}
const CollocationModal: React.FC<addProps> = ({ row, form, indexName }) => {
  const [visible, setVisible] = useState<boolean>(false);

  const { getFieldDecorator } = form;
  const handClick = (row: any) => {
    console.log(row);
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
  const handleCollocayion = () => {
    console.log('ok');
  };
  return (
    <>
      <Tag color="#108ee9" style={{ cursor: 'pointer' }} onClick={() => handClick(row)}>
        配置
      </Tag>
      <Modal visible={visible} onCancel={handClose} onOk={handOk}>
        <Form {...FormItemLayout}>
          <Form.Item label="过滤方式：">
            {getFieldDecorator('g', {
              initialValue: '',
            })(
              <Radio.Group>
                <Radio value={1} style={{ display: 'block' }}>
                  按meta过滤
                </Radio>
                <Radio value={2} style={{ display: 'block' }}>
                  简单过滤
                </Radio>
                {indexName === 'kv' ? (
                  <Tag className="collocayionTag" onClick={handleCollocayion}>
                    查看构建配置
                  </Tag>
                ) : (
                  <>
                    <Radio value={3} style={{ display: 'block' }}>
                      不过滤
                    </Radio>
                  </>
                )}
              </Radio.Group>,
            )}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default CollocationModal;
