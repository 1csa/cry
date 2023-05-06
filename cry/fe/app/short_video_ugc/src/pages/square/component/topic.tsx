import React, { useEffect, useState } from 'react';
import {Button, Form, Input, message} from 'antd';
import { connect } from 'dva';
import { Dispatch, UserModelState } from '@/models/connect';
import Upload from '@/components/Common/Upload';
import { SquareTopicState }  from '../models/topic';
import {getUserName} from '@/utils/dev_helper';
const FormItem = Form.Item;
const { TextArea } = Input;
interface TopicModelProps {
  children?: React.ReactNode,
  form?: any,
  dispatch: Dispatch,
  squareTopicState: SquareTopicState,
  user: UserModelState,
  topic?: TOPIC,
  onCancel?: (show: boolean) => void
}

interface formItemParams {
  children?: React.ReactNode
  label?: string
  field: string
  required?: boolean
  message?: string
  disabled?: boolean
  placeholder?: string
}

const TopicModel: React.FC<TopicModelProps> = ({form ,dispatch, user, topic, onCancel}) => {
  // console.log(topicState, user, '===');
  const { getFieldDecorator, validateFieldsAndScroll, setFieldsValue } = form;
  /** 服务请求 */
  // 数据初始化
  useEffect(()=> {
    if(!topic){ // 新增时 creator operator都是当前用户
      setFieldsValue({
        creator: getUserName(user),
        operator: getUserName(user),
      });
    } else {
      setFieldsValue({
        id: topic.id,
        name: topic.name,
        creator: topic.creator,
        operator: getUserName(user),
        summary: topic.summary,
        icon_text: topic.icon_text,
        icon_color: topic.icon_color,
        image: topic.image
      });
    }
  },[topic]);
  const onSaveTopic = (e: any) => {
    e.preventDefault();
    if(loading){
      console.info('生效中...');
      return;
    }
    validateFieldsAndScroll(async (err: any, value: TOPIC) => {
      if(err){
        console.error("数据错误");
        return;
      }
      // 保存数据
      setLoading(true);
      const {status, reason} = await dispatch({type: 'squareTopic/saveTopic', payload: {
        ...value
      }});
      if(status === 'success'){
        message.success('操作成功!');
      }
      if(status === 'failed'){
        message.error(reason);
      }
      setLoading(false);
      onCancel && onCancel(false);
    });
  }
  const [loading, setLoading] = useState<boolean>(false);
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 6,
      },
    },
  };
  const renderFormItem = ({label, field, required, message, children, disabled, placeholder}:formItemParams) => {
    const rules = [{
      required,
      message
    }];
    return <FormItem label={label}>
      {getFieldDecorator(field, {
        rules,
      })(children? children : <Input disabled={disabled} placeholder={placeholder}/>)}
    </FormItem>
  };

  return (
    <>
      <Form {...formItemLayout} onSubmit={onSaveTopic}>
        {renderFormItem({label: '话题id', field: 'id',disabled: true})}
        {renderFormItem({label: '话题名称', field: 'name', required: true, message: '话题名称不能为空'})}
        {renderFormItem({label: '话题简介', field: 'summary', children: <TextArea autosize={{ minRows: 2, maxRows: 6 }}/>})}
        {renderFormItem({label: '创建者', field: 'creator', disabled: true, required: true})}
        {renderFormItem({label: '操作者', field: 'operator', disabled: true, required: true})}
        {renderFormItem({label: '状态icon文案', field: 'icon_text', placeholder: "一个汉字"})}
        {renderFormItem({label: '状态icon背景色', field: 'icon_color', placeholder: '输入带#色值'})}
  {renderFormItem({label: '背景图', field: 'image',children: <Upload />})}
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" loading={loading}>
            保存
          </Button>
        </FormItem>
      </Form>
    </>
  );
}
const FormWrapper = Form.create()(TopicModel);
export default connect(({squareTopic: squareTopicState, user}: any) => ({
  squareTopicState,
  user
}))(FormWrapper);
