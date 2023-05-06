import React, { FC } from 'react';
import { Form, Input, message, Modal, Select } from 'antd';
import { FormItemLayout } from '@/config/list.config';
import moment from 'moment';
import { SearchApp, SearchScene } from '@/config/list.config';
interface deleteProps {
  form: any;
  visible: boolean;
  isAddModal: boolean;
  row: any;
  closeCallback: () => void;
  deleteModal: any;
}
const { TextArea } = Input;
const { Option } = Select;
// export const FormItemLayout: Object = {
//   labelCol: {
//     xs: { span: 24 },
//     sm: { span: 6 },
//   },
//   wrapperCol: {
//     xs: { span: 24 },
//     sm: { span: 16 },
//   },
// };

const DeleteModal: FC<deleteProps> = ({ form, visible, row, closeCallback, deleteModal }) => {
  const { getFieldDecorator, validateFieldsAndScroll } = form;

  const handClose = () => {
    closeCallback();
  };
  return (
    <>
      <Modal
        title={'删除业务场景'}
        visible={visible}
        onCancel={handClose}
        onOk={() => {
          deleteModal(false, validateFieldsAndScroll);
        }}
        width="40%"
        destroyOnClose={true}
      >
        <Form {...FormItemLayout}>
          <Form.Item label="生效端" style={{ marginBottom: 0 }}>
            {getFieldDecorator('appIdGroup', {
              initialValue: row.appIdGroup,
            })(<p style={{ marginBottom: 0 }}>{row.appIdGroup}</p>)}
          </Form.Item>
          <Form.Item label="生效场景类型" style={{ marginBottom: 0 }}>
            {getFieldDecorator('scene', {
              initialValue: row.scene,
            })(<p style={{ marginBottom: 0 }}>{row.scene}</p>)}
          </Form.Item>
          <Form.Item label="fromId" style={{ marginBottom: 0 }}>
            {getFieldDecorator('fromId', {
              initialValue: row.fromId,
            })(<p style={{ marginBottom: 0 }}>{row.fromId}</p>)}
          </Form.Item>
          <Form.Item label="appId" style={{ marginBottom: 0 }}>
            {getFieldDecorator('appId', {
              initialValue: row.appId,
            })(<p style={{ marginBottom: 0 }}>{row.appId}</p>)}
          </Form.Item>
          <Form.Item label="fakeAppId" style={{ marginBottom: 0 }}>
            {getFieldDecorator('fakeAppId', {
              initialValue: row.fakeAppId,
            })(<p style={{ marginBottom: 0 }}>{row.fakeAppId}</p>)}
          </Form.Item>
          <Form.Item label="场景名称" style={{ marginBottom: 0 }}>
            {getFieldDecorator('scenarioName', {
              initialValue: row.scenarioName,
            })(<p style={{ marginBottom: 0 }}>{row.scenarioName}</p>)}
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
