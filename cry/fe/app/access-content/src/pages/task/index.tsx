import React, { ReactNode, useState, useEffect } from 'react';
import {
  Form,
  Input,
  Divider,
  Radio,
  Button,
  Select,
  Checkbox,
  message
} from 'antd';
import { connect } from 'dva';
import {ConnectState, UserModelState} from '@/models/connect';
import CatchTime from './component/catchtime';
import UploadXlsx from './component/uploadXlsx';
import DownloadTemplate from './component/download_template'
import {Dispatch} from '@/models/connect'
import {
  PLATFORM,
  CONTENT_TYPE_CRAWL_MODE,
  CRAWL_TYPE_TO_EN,
  CATCH_TIME_ITEM_NAME,
  CATCH_TIME_CONFIG
} from '../../config/constant';

const { TextArea } = Input;


const FormItem = Form.Item;
const { Option } = Select;
// import './index.less';
interface TaskProps {
  dispatch: Dispatch
  children?: ReactNode
  form: any,
  user: UserModelState
}
const Task: React.FC<TaskProps> = ({dispatch, form, user}) => {
  const {getFieldDecorator, validateFields, setFieldsValue} = form;
  const [platform, setPlatform] = useState();
  const [other, setOther] = useState<any>([]);
  const [CRAWL_TYPE, setCRAWL_TYPE] = useState<any>([]);
  // const [defaultField, setDefaultField] = useState('');
  useEffect(()=>{
    // 设置默认的platform
    let defaultPlatform = PLATFORM[0];
    changePlatformCallBack(defaultPlatform);
  },[]);

  const changePlatformCallBack = (platform: string) => {
    const other =  CONTENT_TYPE_CRAWL_MODE[platform];

    // 默认的内容类型
    const content_type = other[0].content_type;
    // 抓取方式相关选项
    const CRAWL_TYPE = other.filter((item: string) => item['content_type'] === content_type)[0].children;
    // 抓取方式默认选项
    const crawl_type = CRAWL_TYPE[0].crawl_type;
    setPlatform(platform);
    setOther([...other]);
    setCRAWL_TYPE([...CRAWL_TYPE]);
    // 抓取时间
    const crawlTimeLimit = Object.keys(CATCH_TIME_CONFIG).reduce((acc: any, cur: string) => {
      acc[cur] = CATCH_TIME_CONFIG[cur][0];
      return acc;
    },{});
    setFieldsValue({
      platform,
      content_type,
      crawl_type: crawl_type,
      crawl_mode: 'longtime',
      crawl_time_limit: crawlTimeLimit,
      import_account: 'yidianhao'
    });
  }

  const onPlatformChange = (value: string) => {
    changePlatformCallBack(value);
    // const other = CONTENT_TYPE_CRAWL_MODE[value];
    // setOther([...other]);
  }

  const onContentTypeChange = (value: string) => {
    const CRAWL_TYPE = other.filter((item: string) => item['content_type'] === value)[0].children;
    // console.log(CRAWL_TYPE);
    const crawl_type = CRAWL_TYPE[0].crawl_type;
    setCRAWL_TYPE([...CRAWL_TYPE]);
    setFieldsValue({
      crawl_type
    });
  }
  // const onCrwalTypeChange = (value: string) => {
  //   const default_field = CRAWL_TYPE.filter((item: any) => item.crawl_type === value)[0]['default_field'];
  //   setFieldsValue({
  //     default_field
  //   });
  //   setDefaultField(default_field);
  // };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    validateFields(async (err: any, fieldsValue: any)=>{
      if(err){
        console.log(err);
        return;
      }
      const currentUser = user.currentUser || {};
      fieldsValue['crawl_type'] = CRAWL_TYPE_TO_EN[fieldsValue['crawl_type']];
      fieldsValue['content_type'] = CATCH_TIME_ITEM_NAME[fieldsValue['content_type']];
      fieldsValue['creator_mail'] = currentUser['email'] || currentUser['name']  || '';

      const {code, reason} = await dispatch({
        type: 'Task/saveTask',
        payload: {
          ...fieldsValue
        }
      });
      if(code === 0){
        message.success('任务创建成功!');
      } else {
        message.error(`任务创建失败,原因: ${reason? reason : '未知错误'}`)
      }
    });
  }
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
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
        offset: 4,
      },
    },
  };
  return (
    <>
      <div className="main-content">
        <DownloadTemplate />
        <Divider>
          <span style={{fontSize: '14px', color: '#a5cf9d'}}>新建任务</span>
        </Divider>
        <Form {...formItemLayout}  onSubmit={handleSubmit}>
          {/* <FormItem label="任务ID">
            {getFieldDecorator('id')(<Input disabled={true}/>)}
          </FormItem> */}
          <FormItem label="任务名称">
            {getFieldDecorator('name', {
              rules: [
                {required: true, message: '任务名称必填'}
              ]
            })(<Input />)}
          </FormItem>
          <FormItem label="任务说明">
            {getFieldDecorator('describe', {
              rules: [
                {required: true, message: '任务说明必填'}
              ]
            })(<TextArea rows={3}/>)}
          </FormItem>
          <FormItem label="平台">
            {getFieldDecorator('platform', {
              rules: [
                {required: true, message: '平台必选'}
              ]
            })(<Select onChange={onPlatformChange}>
              {PLATFORM.map(item => <Option key={item}>{item}</Option>)}
            </Select>)}
          </FormItem>
          <FormItem label="类容类型">
            {getFieldDecorator('content_type', {
              rules: [
                {required: true, message: '类容类型'}
              ]
            })(<Select onChange={onContentTypeChange}>
              {other.length && other.map((item: any) => <Option key={item.content_type}>{item.content_type}</Option>)}
            </Select>)}
          </FormItem>
          <FormItem label="抓取方式">
            {getFieldDecorator('crawl_type', {
              rules: [
                {required: true, message: '任务说明必填'}
              ]
            })(<Select>
              {CRAWL_TYPE.length && CRAWL_TYPE.map((item: any) => <Option key={item['crawl_type']}>{item['crawl_type']}</Option>)}
            </Select>)}
          </FormItem>
          {/* <FormItem label="默认抓取字段">
            {getFieldDecorator('default_field')(
              <span>{defaultField}</span>
            )}
          </FormItem> */}
          <FormItem label="是否抓取评论">
            {getFieldDecorator('is_crawl_comment', {
              valuePropName: 'checked',
              initialValue: true,
            })(<Checkbox>
              抓取
            </Checkbox>)}
          </FormItem>
          <FormItem label="抓取量级">
            {getFieldDecorator('crawl_mode')(
            <Radio.Group>
              <Radio value="longtime">持续抓取</Radio>
              <Radio value="once">一次性抓取</Radio>
            </Radio.Group>)}
          </FormItem>
          <FormItem label="抓取时间">
            {getFieldDecorator('crawl_time_limit', {
              rules: [
                {required: true, message: '抓取时间'}
              ]
            })(<CatchTime />)}
          </FormItem>
          <FormItem label="导入账号">
            {getFieldDecorator('import_account')(
            <Radio.Group>
              <Radio value="yidianhao">一点号</Radio>
              <Radio value="ugc">UGC账号</Radio>
            </Radio.Group>)}
          </FormItem>
          <FormItem label="映射关系表">
            {getFieldDecorator('templates', {
              rules: [
                {required: true, message: '映射关系表'}
              ]
            })(<UploadXlsx />)}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">保存</Button>
          </FormItem>
        </Form>
      </div>
    </>
  );
}



export default connect(({user}: ConnectState)=>({
  user
}))(Form.create()(Task));
