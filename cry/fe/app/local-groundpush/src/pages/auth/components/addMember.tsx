import React ,{useState,memo,useEffect,useCallback} from 'react';
import {Input, Modal, Form, DatePicker,Select,message} from 'antd';
import { FormComponentProps } from 'antd/es/form';
const { Option } = Select
import {UserModelState } from '@/models/connect';
import { TeamsDataType } from '@/config/other.d'

import {usePost} from '@/services/common';
interface team_type {
    id:string,
    value:string,
 }
interface  addMember_type extends FormComponentProps{
    visible:boolean,
    teamData:TeamsDataType[]|undefined
    user : UserModelState
    onAddMember: ()=>void
    onOk:()=>void
    onCancel:()=>void
}
interface createPushMan_type{
    "status": string,
    "data": number,
    "code": number
}
const AddMember: React.FC<addMember_type> =(props)=>  {
  const   visible  = props.visible
  const   teamData = props.teamData
  const   { currentUser = {} } = props.user
  const { fetchData: createPushMan } = usePost<createPushMan_type>('/pushMan/createPushMan');
  const { getFieldDecorator,getFieldValue } = props.form;
   async function handleOk(){
    let wx = getFieldValue('wx');
       props.form.validateFields(['teamId', 'name', 'phone', 'startTime', 'uid'], async (err, values) => {
        if (!err) {
             values["updateUser"] = currentUser.name
             values["wx"] = wx
             values["startTime"] = values.startTime.format('YYYY-MM-DD HH:mm:ss')
             teamData&&teamData.forEach(item => {
                 if(item.value == values.teamId){
                    values["teamName"] = item.title
                 }
             });
             createPushMan(values,handleSuccess)
        }
      });

    }
    const handleSuccess = useCallback(()=>{
        props.onAddMember();
        message.success('成员添加成功！');
      }, []);
    const formItemLayout = {
      labelAlign: 'right' as const,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };


  return (
    <>
        <div>
            <Modal title="添加成员" visible={visible} onOk={handleOk} onCancel={()=> props.onCancel()}>
                <Form {...formItemLayout}>
                    <Form.Item label="团地名称" className="form-item">{
                      getFieldDecorator('teamId', {
                        rules: [{ required: true, message: '请选择团队名称' }],
                      })(<Select>{
                          teamData&&teamData.map(({ title,value })=> (
                            <Option key={value}>{title}</Option>
                          ))
                        }</Select>)
                    }</Form.Item>
                    <Form.Item label="姓名" className="form-item">
                     { getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入姓名' }],
                    })(
                        <Input />
                        )}
                    </Form.Item>
                    <Form.Item label="联系电话" className="form-item">{
                      getFieldDecorator('phone', {
                        rules: [{
                          required: true, message: '请输入电话号'
                        }, {
                          pattern: /^1[3,5,6,7,8]\d{9}$/, message: '请输入正确的手机号码'
                        }],
                      })(<Input /> )
                    }</Form.Item>
                    <Form.Item label="uid" className="form-item" >{
                      getFieldDecorator('uid', {
                        rules: [{ required: true, message: '请输入uid' }],
                      })( <Input />)
                    }</Form.Item>
                    <Form.Item label="微信号" className="form-item" >
                        { getFieldDecorator('wx', {
                    })(
                        <Input />
                        )}
                    </Form.Item>
                    <Form.Item label="首次服务" className="form-item" >{
                      getFieldDecorator('startTime', {
                        rules: [{ required: true, message: '请选择首次服务时间' }],
                      })( <DatePicker style={{ width: '100%' }} />)
                    }</Form.Item>
                </Form>
            </Modal>
        </div>
    </>
  );
};
const WrappedHorizontalLoginForm = Form.create<addMember_type>()(AddMember);
export default memo(WrappedHorizontalLoginForm);
