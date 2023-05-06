import React, { FC, useState } from 'react';
import { Button, Form, Input, message, Modal, Radio, Select, Tag } from 'antd';
import moment from 'moment';
import { SearchContentType, SearchArticleSource, SearchApp, SearchScene } from '@/config/list.config';
import { addFilterDebug ,getKvTypeList} from "@/services/filterRules";
import { getFilterCoreTypes} from "@/services/knnAutomation";
import FormItem from './formItem';
interface addProps {
  form: any;
  successCallback: () => void;
}
const { Option } = Select;
export const FormItemLayout: Object = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 20 },
    sm: { span: 12 },
  },
};

const AddModal: FC<addProps> = ({ form, successCallback }) => {
  const { getFieldDecorator, validateFields } = form;
  const [visible, setVisible] = useState<boolean>(false);
  const [articleSource, setArticleSource] = useState<string>('');
  const [appIdGroupValue, setAppIdGroupValue] = useState<string>('')
  const [sceneValue, setSceneValue] = useState<string>('')
  const [dataTypeValue, setDataTypeValue] = useState<string>('')
  const [coreTypesList, setCoreTypesList] = useState<any>([])
  const [kvList, setKvList] = useState<any>([])
  const handClose = () => {
    setVisible(false);
    setArticleSource('')
    setAppIdGroupValue('')
    setSceneValue('')
    setDataTypeValue('')
    setCoreTypesList('')
    setKvList('')
  };
  const handClickAdd = () => {
    setVisible(true);
  };
  const handOk = (event: any) => {
    event.preventDefault();
    validateFields(async(err: any, values: any) => {
      if (!err) {
        let data ={
          name:localStorage.getItem('user')?.split('@')[0],
          ...values,
        }
        const res:any = await addFilterDebug(data)
        if (res.success = true) {
          message.success('添加成功')
          setVisible(false)
          successCallback();
        }
      } else {
        message.warning('创建失败');
      }
    });
  };

  const handleArticleSource = async(data: any) => {
    setArticleSource(data);
    if (data === 'knn') {
      const res:any= await getFilterCoreTypes({params:{
      appIdGroup:appIdGroupValue,
      scene:sceneValue,
      dataType:dataTypeValue
    }})
    if (res.success=true) {
      setCoreTypesList(res.data)
    }
    }
    if (data === 'kv') {
      const res:any= await getKvTypeList({params:{
      appIdGroup:appIdGroupValue,
      scene:sceneValue,
      dataType:dataTypeValue
    }})
    if (res.success=true) {

      console.log(res.data);
      
      setKvList(res.data)
    }
    }

    
  };
  const handleAppIdGroup =(data:any)=>{
    setAppIdGroupValue(data)
  }
  const handleScene =(data:any)=>{
    setSceneValue(data)
  }
  const  handleDataType=(data:any)=>{
    setDataTypeValue(data)
  }
  return (
    <>
      <Button style={{ marginTop: 4, marginLeft: 20 }} type="primary" icon="search" onClick={handClickAdd}>
        创建
      </Button>
      <Modal title="新增过滤任务" visible={visible} onCancel={handClose} onOk={handOk} destroyOnClose={true} width={'30%'}>
        <Form {...FormItemLayout}>
          <Form.Item label="端" style={{ marginBottom: 0 }}>
            {getFieldDecorator('appIdGroup', {
              initialValue: '',
              rules: [{ required: true, message: '新增过滤任务不能为空' }],
            })(
              <Select onChange={handleAppIdGroup}>
                {SearchApp.map(item => (
                  <Option value={item.value} key={item.key}>
                    {item.value}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="场景" style={{ marginBottom: 0 }}>
            {getFieldDecorator('scene', {
              initialValue: '',
              rules: [{ required: true, message: '场景不能为空' }],
            })(
              <Select onChange={handleScene}>
                {SearchScene.map(item => (
                  <Option value={item.value} key={item.key}>
                    {item.value}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="内容类型" style={{ marginBottom: 0 }}>
            {getFieldDecorator('dataType', {
              initialValue: '',
              rules: [{ required: true, message: '内容类型不能为空' }],
            })(
              <Select onChange={handleDataType}>
                {SearchContentType.map(item => (
                  <Option value={item.value} key={item.key}>
                    {item.value}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="数据来源" style={{ marginBottom: 0 }}>
            {getFieldDecorator('sourceType', {
              initialValue: '',
              rules: [{ required: true, message: '数据来源不能为空' }],
            })(
              <Select onChange={handleArticleSource}>
                {SearchArticleSource.map(item => (
                  <Option value={item.value} key={item.key}>
                    {item.key}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
         
          <FormItem ArticleSource={articleSource} form={form} coreTypesList={coreTypesList} kvList={kvList}></FormItem>
          {/* <Form.Item label="创建人" style={{ marginBottom: 0 }}>
            {getFieldDecorator('addName', {
              initialValue: localStorage.getItem('user')?.split('@')[0],
            })(<p style={{ marginBottom: 0 }}>{localStorage.getItem('user')?.split('@')[0]}</p>)}
          </Form.Item>
          <Form.Item label="创建时间" style={{ marginBottom: 0 }}>
            {getFieldDecorator('addtime', {
              initialValue: moment().format('YYYY-MM-DD HH:mm:ss'),
            })(<p style={{ marginBottom: 0 }}>{moment().format('YYYY-MM-DD HH:mm:ss')}</p>)}
          </Form.Item> */}
        </Form>
      </Modal>
    </>
  );
};
export default Form.create()(AddModal);
