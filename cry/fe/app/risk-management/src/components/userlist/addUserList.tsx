import React, { FC } from 'react';
import { 
  message, 
  Button, 
  Drawer,
  Form,
  Input,
  Select,
  Modal,
  Icon,
} from 'antd';
import axios from 'axios';
import { FormItemLayout, TailFormItemLayout } from '@/config/constant';
import appConfig from '@/config/app.config';
import { getCookie } from '@/utils/dev_helper'

const { TextArea } = Input;
const { Option } = Select;

interface AddFormProps {
  form: { getFieldDecorator: any; validateFieldsAndScroll: any; resetFields: any};
  adddrawervisible: boolean;
  setAdddrawervisible?: (param: boolean) => void;
  userList: Array<any>;
  setUserList?: (param: Array<any>) => void;
  typeList: Array<any>;
  type: string;
}


const AddForm: FC<AddFormProps> = (props: AddFormProps) => {
  const { getFieldDecorator, validateFieldsAndScroll, resetFields } = props.form;
  const {
    adddrawervisible,
    setAdddrawervisible,
    userList,
    setUserList,
    typeList,
    type
  } = props;

  const submitAction = async (values) => {
    values.type = type
    values.createUser = decodeURIComponent(getCookie('nickname'))
    const ret = await axios.post(`/api/proxy/${appConfig.API_HOST}/nameList/edit`, values);
    if(ret.data.status === 200) {
      let newList: any[] = [];
      newList = newList.concat(userList);
      newList.unshift(values)
      setUserList(newList)
      message.success('添加成功');
      setAdddrawervisible(false)
    } else {
      message.error(ret.data.message);
    } 
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        Modal.confirm({
          title: 'Confirm',
          content: '确定保存吗？',
          okText: '确认',
          cancelText: '取消',
          onOk(){
            submitAction(values)
          } ,
        });
      }
    });
  }
  const closeDrawer = () => {
    setAdddrawervisible(false);
    resetFields();
  }
  
  return (
    <>
      <Drawer
        title={<div><Icon type="folder-open"></Icon> 添加数据</div>}
        placement="right"
        width="500"
        closable={true}
        onClose={closeDrawer}
        visible={adddrawervisible}
      >
        <Form {...FormItemLayout} onSubmit={handleSubmit}>
          <Form.Item label="userid">
            {getFieldDecorator('value', {
              rules: [{ required: true, message: 'userid必须要填写' }],
            })(
              <Input placeholder="请输入uid"/>
            )}
          </Form.Item>
          <Form.Item label="异常类型">
            {getFieldDecorator('dimension', {
              initialValue: typeList[0].value,
              rules: [{ required: true, message: '异常类型必须要填写' }],
            })(
              <Select style={{width: 120}}>
                {typeList.map(item => <Option value={item.value} key={item.value}>{item.name}</Option>)}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="原因">
            {getFieldDecorator('remarks')(
              <TextArea rows={3} placeholder="请输入原因..."/>
            )}
          </Form.Item>
          <Form.Item {...TailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              保存 
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}
const WrappedDemo = Form.create({ name: 'validate_other' })(AddForm);
export default WrappedDemo;
