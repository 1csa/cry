import React, { FC, useEffect, useState } from 'react';
import { Form, Input, message, Modal, Select } from 'antd';
import moment from 'moment';
interface addProps {
  form: any;
  visible: boolean;
  isAddModal: boolean;
  row: any;
  closeCallback: () => void;
  addModal: any;
  editModal: any;
  filterRuleList:any
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

const AddModal: FC<addProps> = ({ form, visible, isAddModal, row, closeCallback, addModal, editModal, filterRuleList}) => {
  const { getFieldDecorator, validateFieldsAndScroll } = form;
  const [onlineRuleName, setOnlineRuleName] = useState<string>('')
  const [sinkRuleName, setSinkRuleName] = useState<string>('')
  const handClose = () => {
    closeCallback();
    setOnlineRuleName('')
    setSinkRuleName('')
  };
  useEffect(() => {
    row&& setOnlineRuleName(row.onlineRuleName)
    row&& setSinkRuleName(row.sinkRuleName)
  }, [row])
  
  const handleOnlineRuleId =(e:any)=>{
    let obj = filterRuleList.find((item:any)=>item.opsToolRuleId === e.target.value && item.sink===false)
    console.log(obj,'======>ruleObj');
    
    obj ?setOnlineRuleName(obj.ruleName) :setOnlineRuleName('')
  }
  const handleSinkRuleId =(e:any)=>{
    let obj = filterRuleList.find((item:any)=>item.opsToolRuleId === e.target.value && item.sink===true)
     console.log(obj,'======>sinkObj');
    obj ?setSinkRuleName(obj.ruleName) :setSinkRuleName('')
  }
  return (
    <>
      <Modal
        title={isAddModal ? '添加规则映射关系' : '编辑规则映射关系'}
        visible={visible}
        onCancel={handClose}
        onOk={() => {
          isAddModal ? addModal(false, validateFieldsAndScroll) : editModal(false, validateFieldsAndScroll);
        }}
        width="35%"
        destroyOnClose={true}
      >
        <Form {...FormItemLayout}>
          <Form.Item label="内容类型" style={{ marginBottom: 0 }}>
            {getFieldDecorator('dataType', {
              initialValue: isAddModal ? '' : row.dataType,
              rules: [{ required: true, message: '生效端不能为空' }],
            })(
              <Select style={{ width: 150 }}>
                <Option value="news">news</Option>
                <Option value="video">video</Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="在线规则ID" style={{ marginBottom: 0 }} >
            {getFieldDecorator('onlineRuleId', {
              initialValue: isAddModal ? '' : row.onlineRuleId,
              rules: [{ required: true, message: '在线规则ID不能为空' }],
            })(<Input onChange={handleOnlineRuleId}></Input>)}
          </Form.Item>
          <Form.Item label="在线规则名称" style={{ marginBottom: 0 }}>
            {getFieldDecorator('onlineRuleName', {
              initialValue: onlineRuleName,
              rules: [{ required: true, message: '在线规则名称不能为空' }],
            })(<Input style={{marginBottom:0}}></Input>)}
          </Form.Item>
          <Form.Item label="下沉规则ID" style={{ marginBottom: 0 }}>
            {getFieldDecorator('sinkRuleId', {
              initialValue: isAddModal ? '' : row.sinkRuleId,
              rules: [{ required: true, message: '下沉规则ID不能为空' }],
            })(<Input onChange={handleSinkRuleId}></Input>)}
          </Form.Item>
          <Form.Item label="下沉规则名称" style={{ marginBottom: 0 }}>
            {getFieldDecorator('sinkRuleName', {
              initialValue:  sinkRuleName ,
              rules: [{ required: true, message: '下沉规则名称不能为空' }],
            })(<Input style={{marginBottom:0}}></Input>)}
          </Form.Item>
          <Form.Item label="创建人" style={{ marginBottom: 0 }}>
            {/* {getFieldDecorator('cName', {
              initialValue: localStorage.getItem('user')?.split('@')[0],
            })(<p style={{ marginBottom: 0 }}>{localStorage.getItem('user')?.split('@')[0]}</p>)} */}
            <p style={{ marginBottom: 0 }}>{localStorage.getItem('user')?.split('@')[0]}</p>
          </Form.Item>
          <Form.Item label="创建时间" style={{ marginBottom: 0 }}>
            {/* {getFieldDecorator('cTime', {
              initialValue: moment().format('YYYY-MM-DD HH:mm:ss'),
            })()} */}
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
