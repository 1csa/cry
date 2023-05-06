import React, { FC } from 'react';
import { Form, Input, message, Modal, Select } from 'antd';
import moment from 'moment';
import { SearchApp, SearchScene } from '@/config/list.config';
interface addProps {
  form: any;
  visible: boolean;
  isAddModal: boolean;
  row: any;
  closeCallback: () => void;
  addModal: any;
  editModal: any;
}
const { TextArea } = Input;
const { Option } = Select;
export const FormItemLayout: Object = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const AddModal: FC<addProps> = ({ form, visible, isAddModal, row, closeCallback, addModal, editModal }) => {
  const { getFieldDecorator, validateFieldsAndScroll } = form;

  const handClose = () => {
    closeCallback();
  };
  return (
    <>
      <Modal
        title={isAddModal ? '添加业务场景' : '修改业务场景'}
        visible={visible}
        onCancel={handClose}
        onOk={() => {
          isAddModal ? addModal(false, validateFieldsAndScroll) : editModal(false, validateFieldsAndScroll);
        }}
        width="40%"
        destroyOnClose={true}
      >
        <Form {...FormItemLayout}>
          <Form.Item label="生效端" style={{ marginBottom: 0 }}>
            {getFieldDecorator('appIdGroup', {
              initialValue: isAddModal ? '' : row.appIdGroup,
              rules: [{ required: true, message: '生效端不能为空' }],
            })(
              <Select style={{ width: 150 }}>
                {SearchApp.map(item => (
                  <Option value={item.value} key={item.key}>
                    {item.value}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="生效场景类型" style={{ marginBottom: 0 }}>
            {getFieldDecorator('scene', {
              initialValue: isAddModal ? '' : row.scene,
              rules: [{ required: true, message: '生效场景类型不能为空' }],
            })(
              <Select style={{ width: 150 }}>
                {SearchScene.map(item => (
                  <Option value={item.value} key={item.key}>
                    {item.value}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="fromId" style={{ marginBottom: 0 }}>
            {getFieldDecorator('fromId', {
              initialValue: isAddModal ? '' : row.fromId,
              rules: [{ required: true, message: 'fromId不能为空' }],
            })(<Input></Input>)}
          </Form.Item>
          <Form.Item label="appId" style={{ marginBottom: 0 }}>
            {getFieldDecorator('appId', {
              initialValue: isAddModal ? '' : row.appId,
              rules: [{ required: true, message: 'appId不能为空' }],
            })(<Input></Input>)}
          </Form.Item>
          <Form.Item label="fakeAppId" style={{ marginBottom: 0 }}>
            {getFieldDecorator('fakeAppId', {
              initialValue: isAddModal ? '' : row.fakeAppId,
              rules: [{ required: true, message: 'fakeAppId不能为空' }],
            })(<Input></Input>)}
          </Form.Item>
          <Form.Item label="场景名称" style={{ marginBottom: 0 }}>
            {getFieldDecorator('scenarioName', {
              initialValue: isAddModal ? '' : row.scenarioName,
              rules: [{ required: true, message: '场景名称不能为空' }],
            })(<Input></Input>)}
          </Form.Item>
          <Form.Item label="创建人" style={{ marginBottom: 0 }}>
            {/* {getFieldDecorator('cName', {
              initialValue: isAddModal ? localStorage.getItem('user')?.split('@')[0] : row.cName,
            })(<p style={{ marginBottom: 0 }}>{isAddModal ? localStorage.getItem('user')?.split('@')[0] : row.cName}</p>)} */}
            <p style={{ marginBottom: 0 }}>{isAddModal ? localStorage.getItem('user')?.split('@')[0] : row.cName}</p>
          </Form.Item>
          <Form.Item label="创建时间" style={{ marginBottom: 0 }}>
            {/* {getFieldDecorator('cTime', {
              initialValue: '',
            })(<p style={{ marginBottom: 0 }}>{moment().format('YYYY-MM-DD HH:mm:ss')}</p>)} */}
            <p style={{ marginBottom: 0 }}>{isAddModal ? moment().format('YYYY-MM-DD HH:mm:ss') : moment(row.cTime).format('YYYY-MM-DD HH:mm:ss')}</p>
          </Form.Item>
          {isAddModal ? (
            ''
          ) : (
            <Form.Item style={{ marginBottom: 0 }}>
              {getFieldDecorator('primaryId', {
                initialValue: row.primaryId,
              })(<p style={{ marginBottom: 0 }}></p>)}
            </Form.Item>
          )}
        </Form>
      </Modal>
    </>
  );
};
export default Form.create()(AddModal);
