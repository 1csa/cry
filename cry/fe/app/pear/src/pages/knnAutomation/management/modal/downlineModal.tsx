import React, { useState } from 'react';
import { Modal, Form, Tag, message, Input } from 'antd';
import { getTaskFlow } from '@/services/knnAutomation';
import { FormItemLayouts } from '@/config/list.config';
interface DownlineModalProps {
  form: any;
  row: any;
  successCallback: () => void;
}
const { TextArea } = Input;
const DownlineModal: React.FC<DownlineModalProps> = ({ form, row, successCallback }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [offDataList, setOffDataList] = useState<any>('');
  const { getFieldDecorator } = form;
  const handleOk = (e: any) => {
    let username: string | null = localStorage.getItem('user');
    e.preventDefault();
    form.validateFieldsAndScroll(async (err: any, values: any) => {
      if (!err) {
        if (values.check === '下线') {
          let res = await getTaskFlow({
            factor: offDataList.factor,
            type: offDataList.type,
            flowStatus: 'DISCARD',
            discardReason: values.discardReason,
            author: username?.split('@')[0],
          });
          if (res.success == true) {
            setVisible(false);
            message.success('下线成功');
            successCallback();
          }
        } else {
          message.warning('验证内容必须是下线');
        }
      }
    });
  };
  return (
    <>
      <Tag
        color="#108ee9"
        style={{ cursor: 'pointer' }}
        onClick={() => {
          setVisible(!visible);
          setOffDataList({ ...row });
        }}
      >
        下线
      </Tag>
      <Modal
        title={offDataList.type + '下线'}
        cancelText="取消"
        okText="确定"
        visible={visible}
        destroyOnClose={true}
        onOk={handleOk}
        onCancel={() => setVisible(false)}
      >
        <h3 style={{ color: 'red', textAlign: 'center' }}>下线后将删除机器配置，清空数据文件，请谨慎操作！！！！</h3>
        <Form {...FormItemLayouts} labelAlign="center">
          <Form.Item label="Type:" style={{ marginBottom: 0 }}>
            {getFieldDecorator('type')(<b>{offDataList.type}</b>)}
          </Form.Item>
          <Form.Item label="Factor:" style={{ marginBottom: 0 }}>
            {getFieldDecorator('factor')(<b>{offDataList.factor}</b>)}
          </Form.Item>
          <Form.Item label="重要等级:" style={{ marginBottom: 0 }}>
            {getFieldDecorator('level')(<b>{offDataList.level}</b>)}
          </Form.Item>
          <Form.Item label="端:" style={{ marginBottom: 0 }}>
            {getFieldDecorator('app')(<b>{offDataList.app}</b>)}
          </Form.Item>
          <Form.Item label="数据类型:" style={{ marginBottom: 0 }}>
            {getFieldDecorator('dataType')(<b>{offDataList.dataType}</b>)}
          </Form.Item>
          <Form.Item label="场景:" style={{ marginBottom: 0 }}>
            {getFieldDecorator('scene')(<b>{offDataList.scene}</b>)}
          </Form.Item>
          {/* </Col> */}
          {/* </Row> */}
          <Form.Item label="下线原因:" style={{ marginBottom: 0 }}>
            {getFieldDecorator('discardReason')(<TextArea placeholder="说明下线原因" style={{ width: 220 }} />)}
          </Form.Item>
          <Form.Item label="验证:">
            {getFieldDecorator('check', {
              rules: [{ required: true, message: '必须填写验证' }],
            })(<Input placeholder="请输入'下线'这两个字进行验证" style={{ width: 220 }} />)}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default Form.create()(DownlineModal);
