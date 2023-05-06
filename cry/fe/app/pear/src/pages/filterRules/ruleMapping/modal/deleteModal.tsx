import React, { FC, useState } from 'react';
import { Form, Input, message, Modal, Select, Tag } from 'antd';
import { FormItemLayout } from '@/config/list.config';
import moment from 'moment';

import { sinkQuery } from '@/services/filterRules';
interface deleteProps {
  form: any;
  visible: boolean;
  isAddModal: boolean;
  row: any;
  closeCallback: () => void;
  deleteModal: any;
}
const DeleteModal: FC<deleteProps> = ({ form, row, closeCallback }) => {
  const { getFieldDecorator, validateFieldsAndScroll } = form;
  const [visible, setVisible] = useState<boolean>(false);
  const handClose = () => {
    setVisible(false);
  };
  const handleDetial = () => {
    setVisible(true);
  };
  const handOk = async () => {
    validateFieldsAndScroll(async (err: any, values: any) => {
      if (!err) {
        let res: any = await sinkQuery({
          ...values,
          username: localStorage.getItem('user')?.split('@')[0],
          type: 'delete',
        });
        if (res?.success === true) {
          message.success('删除成功');
          setVisible(false);
          closeCallback();
        }
      }
    });
  };
  return (
    <>
      <Tag color="#108ee9" style={{ cursor: 'pointer' }} onClick={handleDetial}>
        删除
      </Tag>
      <Modal title={'删除规则映射'} visible={visible} onCancel={handClose} onOk={handOk} width="40%" destroyOnClose={true}>
        <Form {...FormItemLayout}>
          <Form.Item label="内容类型" style={{ marginBottom: 0 }}>
            {getFieldDecorator('dataType', {
              initialValue: row.dataType,
            })(<p style={{ marginBottom: 0 }}>{row.dataType}</p>)}
          </Form.Item>
          <Form.Item label="在线规则ID" style={{ marginBottom: 0 }}>
            {getFieldDecorator('onlineRuleId', {
              initialValue: row.onlineRuleId,
            })(<p style={{ marginBottom: 0 }}>{row.onlineRuleId}</p>)}
          </Form.Item>
          <Form.Item label="在线规则名称" style={{ marginBottom: 0 }}>
            {getFieldDecorator('onlineRuleName', {
              initialValue: row.onlineRuleName,
            })(<p style={{ marginBottom: 0 }}>{row.onlineRuleName}</p>)}
          </Form.Item>
          <Form.Item label="下沉规则ID" style={{ marginBottom: 0 }}>
            {getFieldDecorator('sinkRuleId', {
              initialValue: row.sinkRuleId,
            })(<p style={{ marginBottom: 0 }}>{row.sinkRuleId}</p>)}
          </Form.Item>
          <Form.Item label="下沉规则名称" style={{ marginBottom: 0 }}>
            {getFieldDecorator('sinkRuleName', {
              initialValue: row.sinkRuleName,
            })(<p style={{ marginBottom: 0 }}>{row.sinkRuleName}</p>)}
          </Form.Item>
          <Form.Item label="创建人" style={{ marginBottom: 0 }}>
            {/* {getFieldDecorator('cName', {
              initialValue: isAddModal ? localStorage.getItem('user')?.split('@')[0] : row.cName,
            })(<p style={{ marginBottom: 0 }}>{isAddModal ? localStorage.getItem('user')?.split('@')[0] : row.cName}</p>)} */}
            <p style={{ marginBottom: 0 }}>{row.cName}</p>
          </Form.Item>
          <Form.Item label="创建时间" style={{ marginBottom: 0 }}>
            {/* {getFieldDecorator('cTime', {
              initialValue: '',
            })(<p style={{ marginBottom: 0 }}>{moment().format('YYYY-MM-DD HH:mm:ss')}</p>)} */}
            <p style={{ marginBottom: 0 }}>{moment(row.cTime).format('YYYY-MM-DD HH:mm:ss')}</p>
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            {getFieldDecorator('primaryId', {
              initialValue: row.primaryId,
            })(<p style={{ marginBottom: 0 }}></p>)}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default Form.create()(DeleteModal);
