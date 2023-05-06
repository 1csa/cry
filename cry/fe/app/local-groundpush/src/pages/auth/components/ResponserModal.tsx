import React, {memo, useState, useCallback, useEffect} from 'react';
import { Input, Button, Form } from 'antd';
import { FormComponentProps } from 'antd/es/form';

import { TeamProps } from '@/config/auth/auth.d';
import { useUpdate } from '@/services/common';

interface ResponserModalProps extends FormComponentProps {
  value: Partial<TeamProps>;
  onCancel: ()=> void;
  onCommit: (name: string, phone: string, weixin?: string)=> void;
}

const ResponserModal: React.FC<ResponserModalProps> =({value, onCancel, onCommit, form})=> {
  const { getFieldDecorator, getFieldValue, getFieldError, setFieldsValue } = form;
  const { updateLoading, updateData } = useUpdate('/pushTeam/updateLeaderInfo');

  useEffect(()=>{
    const { leaderName, leaderPhone, leaderWx } = value;

    setFieldsValue({name: leaderName, phone: leaderPhone, weixin: leaderWx})
  },[value]);

  // 信息修改的信息提交部分
  const handleCommit = useCallback(()=>{
    const name = getFieldValue('name');
    const phone = getFieldValue('phone');
    const weixin = getFieldValue('weixin');

    const nameError = getFieldError('name');
    const phoneError = getFieldError('phone');

    if (!nameError && !phoneError) {
      updateData({
        id: value.id, leaderName: name, leaderPhone: phone, leaderWx: weixin
      }, ()=>onCommit(name, phone, weixin));
    }
  }, [value]);

  return (
    <>
      <Form className="form" labelAlign="right" labelCol={{span: 4}} wrapperCol={{span: 16}}>
        <Form.Item className="form-item" label="负责人" colon={true}>
        {
          getFieldDecorator('name', {
            rules: [{
              required: true,
              message: '请输入负责人姓名'
            }],
          })(<Input/>)
        }
        </Form.Item>
        <Form.Item className="form-item" label="联系电话">
        {
          getFieldDecorator("phone", {
            rules: [
              { required: true, message: '"请输入负责人联系电话'},
              { pattern: /^1[3,5,7,8]\d{9}$/, message: '请输入正确的手机号码'}
            ]
          })(<Input/>)
        }
        </Form.Item>
        <Form.Item className="form-item" label="微信号">
        {
          getFieldDecorator('weixin', {})(<Input/>)
        }
        </Form.Item>
      </Form>
      <div className="form-operation">
        <Button
          size="small"
          type="primary"
          loading={updateLoading}
          onClick={handleCommit}
        >保存</Button>
        <Button size="small" onClick={onCancel}>取消</Button>
      </div>
    </>
  );
}

const ChargerForm = Form.create<ResponserModalProps>({
  name: 'charger',
})(ResponserModal);

export default ChargerForm;
