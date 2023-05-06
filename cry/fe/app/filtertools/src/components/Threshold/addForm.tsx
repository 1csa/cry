import React, { FC } from 'react';
import { 
  Button, 
  Drawer,
  Form,
  Input,
  Select,
  Modal,
  InputNumber,
} from 'antd';
import { FormItemLayout, TailFormItemLayout, ThresholdSelectCon } from '@/config/constant';


interface AddThresholdFormProps {
  form: { getFieldDecorator: any; validateFieldsAndScroll: any; resetFields: any};
  adddrawervisible: boolean;
  setAdddrawervisible?: (param: string) => void;
  submitAction?: (param: Array<any>) => void;
  threshold: Array<any>;
  listName: Array<any>;
  currenttab: string;
}

const AddThresholdForm: FC<AddThresholdFormProps> = (props: AddThresholdFormProps) => {
  const { getFieldDecorator, validateFieldsAndScroll, resetFields } = props.form;
  const {
    adddrawervisible,
    setAdddrawervisible,
    submitAction,
    threshold,
    listName,
    currenttab,
  } = props;

  const handleSubmit = (e: any) => {
    e.preventDefault();
    validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {
        Modal.confirm({
          title: 'Confirm',
          content: '确定添加此数据吗？',
          okText: '确认',
          cancelText: '取消',
          onOk(){
            let newThreshold: React.SetStateAction<any[]> = [];
            newThreshold = newThreshold.concat(threshold);
            values.data.level = `${parseInt(values.data.level)}级`;
            if (newThreshold[0][values.name]) {
              newThreshold[0][values.name].push(values.data);
            } else {
              newThreshold[0][values.name] = [];
              newThreshold[0][values.name].push(values.data);
            }
            submitAction(newThreshold);
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
        title="添加数据"
        placement="right"
        width="500"
        closable={true}
        onClose={closeDrawer}
        visible={adddrawervisible}
      >
        <Form {...FormItemLayout} onSubmit={handleSubmit}>
          <Form.Item label="阈值属性">
            {getFieldDecorator('name', {
              initialValue: currenttab,
            })(
              <Select>
                {listName.map(item => <Select.Option value={item.key}>{item.name}</Select.Option>)}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="等级" extra="输入格式：[数字]级。如'1级'">
            {getFieldDecorator('data.level', {
              initialValue: '',
              rules: [{ required: true, message: '等级不能为空!',}],
            })(
              <InputNumber 
                min={1}
                max={100}
                formatter={value => `${value}级`}
                parser={value => value.replace('级', '')}
              />
            )}
          </Form.Item>
          <Form.Item label="说明">
            {getFieldDecorator('data.desc', {
              initialValue: '',
            })(
              <Input/>
            )}
          </Form.Item>
          <Form.Item label="条件">
            {getFieldDecorator('data.condition', {
              initialValue: '介于',
            })(
              <Select>
                {ThresholdSelectCon.map(item => <Select.Option value={item.value}>{item.key}</Select.Option>)}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="阈值" extra="若条件为[介于]，则应为[min,max]。如'0.2,0,4'">
            {getFieldDecorator('data.value', {
              initialValue: '',
              rules: [{ required: true, message: '阈值不能为空!', whitespace: true}],
            })(
              <Input/>
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
const WrappedDemo = Form.create({ name: 'validate_other' })(AddThresholdForm);
export default WrappedDemo;
