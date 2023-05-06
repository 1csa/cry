import React, { FC } from 'react';
import { 
  message, 
  Button, 
  Drawer,
  Form,
  Input,
  Select,
  Modal,
  Tooltip,
  Icon,
} from 'antd';
import axios from 'axios';
import { FormItemLayout, TailFormItemLayout } from '@/config/constant';
import { getCookie } from '@/utils/dev_helper'
import { countUnitList } from '@/config/constant';
import appConfig from '@/config/app.config';


const { TextArea } = Input;
const { Option } = Select;
interface AddCoverFormProps {
  form: { getFieldDecorator: any; validateFieldsAndScroll: any; resetFields: any};
  adddrawervisible: boolean;
  setAdddrawervisible?: (param: Boolean) => void;
  setFeatureList?: (param: Array<any>) => void;
  featureList: Array<any>;
  categoryList: Array<any>;
  defaultform: Object;
  type1List: Array<any>;
  type2List: Array<any>;
}


const ConfigDetail: FC<AddCoverFormProps> = (props: AddCoverFormProps) => {
  const { getFieldDecorator, validateFieldsAndScroll, resetFields } = props.form;
  const {
    adddrawervisible,
    setAdddrawervisible,
    setFeatureList,
    featureList,
    defaultform,
    type1List,
    type2List,
  } = props;

  const submitAction = async (values) => {
    const createUser = decodeURIComponent(getCookie('nickname'))
    if (defaultform.id === -1) { //添加
      values.createUser = createUser
    } else { //修改
      values.id = defaultform.id
    }
    if (values.calInterval.trim().length > 0) {
      values.calInterval = values.calInterval.trim() + values.countUnit
    }
    delete values.countUnit
    // console.log(values)
    const ret = await axios.post(`/api/proxy/${appConfig.API_HOST}/feature/edit`, values);
    if(ret.data.status === 200) {
      let newFeatureList: any[] = [];
      newFeatureList = newFeatureList.concat(featureList);
      if (defaultform.id === -1) {
        message.success('添加成功');
        newFeatureList.unshift(values)
      } else {
        message.success('修改成功');
        newFeatureList.map((item,index)=>{
          if (item.id === values.id) {
            newFeatureList[index] = values
          }
        })
      }
      setFeatureList(newFeatureList)
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
  
  const selectUnit = getFieldDecorator('countUnit', {
    initialValue: defaultform.countUnit || 's',
  })(
    <Select style={{ width: 90 }}>
      {countUnitList.map(item => <Option value={item.value} key={item.value}>{item.name}</Option>)}
    </Select>
  );
  return (
    <>
      <Drawer
        title={<div><Icon type="folder-open"></Icon> 添加数据</div>}
        placement="right"
        width="650"
        closable={true}
        onClose={closeDrawer}
        visible={adddrawervisible}
      >
        <Form {...FormItemLayout} onSubmit={handleSubmit}>
          <Form.Item label="特征中文">
            {getFieldDecorator('featureCnName', {
              initialValue: defaultform.featureCnName,
              rules: [{ required: true, message: '特征名称必须要填写' }],
            })(
              <Input/>
            )}
          </Form.Item>
          <Form.Item label="特征英文">
            {getFieldDecorator('featureEnName', {
              initialValue: defaultform.featureEnName,
              // rules: [{ required: true, message: '特征英文名称必须要填写' }],
            })(
              <Input/>
            )}
          </Form.Item>
          <Form.Item label="特征别名">
            {getFieldDecorator('aliasName', {
              initialValue: defaultform.aliasName,
              // rules: [{ required: true, message: '特征别名必须要填写' }],
            })(
              <Input/>
            )}
          </Form.Item>
          <Form.Item label="特征说明">
            {getFieldDecorator('calMethod', {
              initialValue: defaultform.calMethod,
            })(
              <TextArea rows={3}/>
            )}
          </Form.Item>
          <Form.Item label="特征类型1">
            {getFieldDecorator('level1Type', {
              initialValue: defaultform.level1Type,
              rules: [{ required: true, message: '特征类型1必须要填写' }],
            })(
              <Select style={{width: 120}}>
                {type1List.map(item => <Option value={item.value} key={item.value}>{item.value}</Option>)}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="特征类型2">
            {getFieldDecorator('level2Type', {
              initialValue: defaultform.level2Type,
              rules: [{ required: true, message: '特征类型2必须要填写' }],
            })(
              <Select style={{width: 120}}>
                {type2List.map(item => <Option value={item.value} key={item.value}>{item.value}</Option>)}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="来源表">
            {getFieldDecorator('rawTableName', {
              initialValue: defaultform.rawTableName,
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item label="字段名">
            {getFieldDecorator('calFields', {
              initialValue: defaultform.calFields,
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item label="限制条件">
            {getFieldDecorator('calConditions', {
              initialValue: defaultform.calConditions,
            })(
              <TextArea rows={3}/>
            )}
          </Form.Item>
          <Form.Item label="计算周期">
            {getFieldDecorator('calInterval', {
              initialValue: defaultform.calInterval,
            })(
              <Input addonAfter={selectUnit} />
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
const WrappedDemo = Form.create()(ConfigDetail);
export default WrappedDemo;
