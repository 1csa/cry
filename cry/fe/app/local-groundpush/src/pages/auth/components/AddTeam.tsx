import React, { memo, useCallback, useState } from 'react';
import { Form, Input, Select, Button, DatePicker, Modal, Icon, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import moment from 'moment';

import { usePost } from '@/services/common';
import { CitiesDataType } from '@/config/other';
import { YSelect } from '@/components';
import { stringifyDate } from '@/utils/dev_helper';

interface AddTeamformProps extends FormComponentProps {
  cities?: CitiesDataType[];
  currentUser?: string;
  onCommit: (teamName: string, teamNum: number)=>void;
  onCancel: ()=>void;
}

const AddTeamModal: React.FC<AddTeamformProps> =({ cities=[], form, onCommit, onCancel, currentUser="admin" })=>{
  const { getFieldDecorator, getFieldValue, validateFields } = form;

  const { data: createRes, fetchData: commitInfo } = usePost('/pushTeam/createTeam');
  const [ showSuccessModal, setShowSuccessModal ] = useState(false);

  const handleCommit =useCallback(()=>{
    let leaderWx = getFieldValue('leaderWx');
    validateFields(['teamName', 'leaderPhone', 'cityIds', 'leaderName', 'startTime'], (err, value)=>{
      if (!err) {
        const { teamName, leaderName, leaderPhone, cityIds, startTime } = value;
        commitInfo({
          teamName, leaderName, leaderPhone, leaderWx,
          cityIds: [cityIds],
          cooperationStartTime: moment(startTime).format('YYYY-MM-DD HH:mm:ss'),
          updateUser: currentUser
        }, onCommitSuccess)
      }
    });
  }, [createRes]);
  // 其实这里的createRes是一个引用值，那么每次页面渲染所获得的结果都是不一样的，那么其实这个函数其实是每次都会变化的？
  // 并不，虽然没看具体的callback的依赖引用比较，但是显然不只是浅比较，也不是值比较
  // 当传入的依赖是一个空数组，那么这个callback返回的句柄是永远不会变的，这样在传给子组件作为prop的时候，在子组件使用memo返回的话那么可以算作是一种优化方式

  const onCommitSuccess = useCallback(()=>{
    onCancel();
    setShowSuccessModal(true);
  }, []);

  const handleConfirmAdd = useCallback(()=>{
    let teamName = getFieldValue('teamName');
    setShowSuccessModal(false);
    onCommit(teamName, createRes);
  },[createRes]);

  return (
    <>
      <Form className="form" labelAlign="right" labelCol={{span: 4}} wrapperCol={{span: 16}}>
        <Form.Item className="form-item" label="团队名称">{
          getFieldDecorator("teamName", {
            rules: [{
              required: true, message: '请输入团队名称'
            },{
              max: 8, message: '团队名称不能超过8个字'
            }]
          })(<Input />)
        }</Form.Item>
        <Form.Item className="form-item" label="负责人">{
          getFieldDecorator("leaderName", {
            rules: [{
              required: true, message: '请输入负责人名称'
            }]
          })(<Input />)
        }</Form.Item>
        <Form.Item className="form-item" label="联系电话">{
          getFieldDecorator("leaderPhone", {
            rules: [{
              required: true, message: '请输入手机号码'
            }, {
              pattern: /^1[3,5,6,7,8]\d{9}$/, message: '请输入正确的手机号码'
            }]
          })(<Input />)
        }</Form.Item>
        <Form.Item className="form-item" label="微信号">{
          getFieldDecorator("leaderWx", {})(<Input />)
        }</Form.Item>
        <Form.Item className="form-item" label="地推城市">{
          getFieldDecorator("cityIds", {
            rules: [{
              required: true, message: '请选择地推城市'
            }]
          })(<YSelect
            placeholder="请选择地推城市"
            options={cities}
            filter={true}
          />)
        }</Form.Item>
        <Form.Item className="form-item" label="合作起始">{
          getFieldDecorator("startTime", {
            rules: [{
              required: true, message: '请选择合作起始时间'
            }]
          })(<DatePicker/>)
        }</Form.Item>
      </Form>
      <div className="form-operation">
        <Button
          size="small"
          type="primary"
          onClick={handleCommit}
        >提交</Button>
      </div>
      <Modal closable={false} footer={null} title={null} width={280} visible={showSuccessModal}>
        <div className="successModal">
          <div className="successModal-tip">
            <Icon type="check-circle" theme="filled" className="successModal-tip-icon" />
            <span>生成成功！</span>
          </div>
          <div className="successModal-info">
            <p>团队名称: {getFieldValue('teamName')}</p>
            <p>团队编号: {createRes}</p>
          </div>
          <Button type="primary" size="small" onClick={handleConfirmAdd}>确定</Button>
        </div>
      </Modal>
    </>
  )
};

const AddTeamform = Form.create<AddTeamformProps>()(AddTeamModal);

export default memo(AddTeamform);
