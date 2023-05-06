import React, { FC, useEffect, useState } from 'react';
import {
  message,
  Button,
  Drawer,
  Form,
  Input,
  Select,
  Radio,
  Modal,
  Tag,
  Tooltip,
  Icon,
} from 'antd';
import request from '@/utils/request';
import axios from 'axios';
import {
  FormItemLayout,
  TailFormItemLayout,
  UserCoverFormOptionList,
  LogInfo,
} from '@/config/constant';
import { saveKibana, saveStaticLog } from '@/utils/log';

interface AddCoverFormProps {
  form: { getFieldDecorator: any; validateFieldsAndScroll: any; resetFields: any };
  adddrawervisible: boolean;
  setAdddrawervisible?: (param: string) => void;
  setResult?: (param: Array<any>) => void;
  setAppidpopvisible?: (param: Array<any>) => void;
  result: Array<any>;
  appidlist: Array<any>;
  newsrulelist: Array<any>;
  videorulelist: Array<any>;
  defaultform: Object;
  citylist: Array<any>;
  isDev: boolean;
  // usercslist:  Array<any>;
}
const formOptionList = UserCoverFormOptionList;

const AddCoverForm: FC<AddCoverFormProps> = (props: AddCoverFormProps) => {
  const [saving, setSaving] = useState<Boolean>(false);
  const { getFieldDecorator, validateFieldsAndScroll, resetFields } = props.form;
  const [newsID, setNewsID] = useState<string>('')
  const [videoID, setVideoID] = useState<string>('')
  const {
    adddrawervisible,
    setAdddrawervisible,
    setResult,
    setAppidpopvisible,
    result,
    appidlist,
    newsrulelist,
    videorulelist,
    defaultform,
    citylist,
    isDev,
    // usercslist,
  } = props;
  // console.log(defaultform);
  // useEffect(() => {
  //     handleNews(defaultform?.ruleId),
  //     handleVideo(defaultform?.videoId)
  // }, [defaultform?.ruleId,defaultform?.videoId])
  
  const brandPrefixSelector = getFieldDecorator('brand.include', {
    initialValue: defaultform.brand.include,
  })(
    <Select style={{ width: 90 }}>
      {formOptionList.includeList.map((item: any) => (
        <Select.Option value={item.value} key={item.value}>
          {item.key}
        </Select.Option>
      ))}
    </Select>,
  );
  const userPrefixSelector = getFieldDecorator('userRiseCS.include', {
    initialValue: defaultform.userRiseCS.include,
  })(
    <Select style={{ width: 90 }}>
      {formOptionList.includeList.map((item: any) => (
        <Select.Option value={item.value} key={item.value}>
          {item.key}
        </Select.Option>
      ))}
    </Select>,
  );
  const businessPrefixSelector = getFieldDecorator('businessArea.include', {
    initialValue: defaultform.businessArea.include,
  })(
    <Select style={{ width: 90 }}>
      {formOptionList.includeList.map((item: any) => (
        <Select.Option value={item.value} key={item.value}>
          {item.key}
        </Select.Option>
      ))}
    </Select>,
  );
  const bucketPrefixSelector = getFieldDecorator('bucket.include', {
    initialValue: defaultform.bucket.include,
  })(
    <Select style={{ width: 90 }}>
      {formOptionList.includeList.map((item: any) => (
        <Select.Option value={item.value} key={item.value}>
          {item.key}
        </Select.Option>
      ))}
    </Select>,
  );

  const submitAction = async values => {
    // if (!values.minus3) {
    //   delete values.minus3;
    // }
    values.dirtyLike = '';
    values.city.content = values.city.content.join(',');
    if (values.bucket.content !== 'all' && typeof values.bucket.content === 'string') {
      values.bucket.content = values.bucket.content.split(',');
    }
    if (typeof values.userRiseCS.content === 'string') {
      values.userRiseCS.content =
        values.userRiseCS.content.length > 0 ? values.userRiseCS.content.split(',') : ['all'];
    }
    if (typeof values.brand.content === 'string') {
      values.brand.content =
        values.brand.content.length > 0 ? values.brand.content.split(',') : ['all'];
    }
    if (typeof values.distribution === 'string') {
      values.distribution =
        values.distribution.length > 0 ? values.distribution.split(',') : ['all'];
    }
    // console.log(values);
    const act = 'save',
      value = values;
    value.location = window.location.href;
    value.debug = isDev ? 1 : 0;
    const { log_domain, log_secret, usercover_key } = LogInfo;
    const userName = localStorage.getItem('userName');

    if (values.groupId === undefined || values.groupId === -1) {
      const ret = await request.post(`/api/filtertools/addUserCover?isdev=${isDev}`, {
        // 前端传参添加userName字段 用于钉钉消息通知
        // 后端会做userName字段删除逻辑 避免表结构破坏
        data: { ...values, userName },
      });
      if (ret.code === 0) {
        let newresult: any[] = [];
        newresult = newresult.concat(result);
        newresult.unshift(ret.result);
        setResult(newresult);
        message.success('添加成功');
        closeDrawer();
        saveStaticLog(log_domain, log_secret, [
          {
            action: act,
            key: usercover_key,
            value: value ? JSON.stringify(value) : '',
            fromid: '',
            comment: '',
          },
        ]);
        saveKibana('save-add', usercover_key, value);
      } else {
        message.error(ret.message);
      }
    } else {
      values._id = defaultform._id;
      // console.log(values);
      const ret2 = await request.post(`/api/filtertools/updateUserCover?isdev=${isDev}`, {
        data: { ...values, userName },
      });
      if (ret2.code === 0) {
        let newresult: any[] = [];
        newresult = newresult.concat(result);
        newresult.map((item, index) => {
          if (item.groupId === values.groupId) {
            newresult[index] = values;
          }
        });
        setResult(newresult);
        message.success('保存成功');
        closeDrawer();
        saveStaticLog(log_domain, log_secret, [
          {
            action: act,
            key: usercover_key,
            value: value ? JSON.stringify(value) : '',
            fromid: '',
            comment: '',
          },
        ]);
        saveKibana('save-edit', usercover_key, value);
      } else {
        message.error(ret2.message);
      }
    }
    setSaving(false);
  };
  const handleSubmit = e => {
    e.preventDefault();
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        setSaving(true);
        Modal.confirm({
          title: 'Confirm',
          content: '确定保存吗？',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            // console.log(values);
            submitAction(values);
          },
          onCancel() {
            setSaving(false);
          },
        });
      }
    });
  };
  const closeDrawer = () => {
    setNewsID('')
    setVideoID('')
    setSaving(false);
    setAdddrawervisible(false);
    resetFields();
  };
  //储存过滤规则的ID
//  const handleNews =(data:any)=>{
//    if(data!=="无" &&  newsrulelist.find((item)=>item.name===data)!==undefined){
//     let obj = newsrulelist.find((item)=>item.name===data)
//     setNewsID(obj.id)
//   };
//  }
//  const handleVideo =(data:any)=>{
//   if(data!=="无" &&  videorulelist.find((item)=>item.name===data)!==undefined){
//     let obj = videorulelist.find((item)=>item.name===data)
//     setVideoID(obj.id)
//   };
//  }
  return (
    <>
      <Drawer
        title="添加数据"
        placement="right"
        width="750"
        closable={true}
        onClose={closeDrawer}
        visible={adddrawervisible}
      >
        <Form
          {...FormItemLayout}
          onSubmit={handleSubmit}
          style={{
            overflow: 'hidden',
          }}
        >
          {defaultform.groupId && defaultform.groupId !== '-1' && (
            <Form.Item label="编号">
              {getFieldDecorator('groupId', {
                initialValue: defaultform.groupId || '-1',
              })(<Input disabled />)}
            </Form.Item>
          )}
          <Form.Item label="环境">
            {getFieldDecorator('env', {
              initialValue: defaultform.env || 'all',
            })(
              <Select>
                {formOptionList.envList.map((item: any) => (
                  <Select.Option value={item} key={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="操作系统">
            {getFieldDecorator('os', {
              initialValue: defaultform.os || 'all',
            })(
              <Select>
                {formOptionList.osList.map((item: any) => (
                  <Select.Option value={item} key={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="appId" extra="不包含时，内容不能为all">
            {getFieldDecorator('appId.include', {
              initialValue: defaultform.appId.include,
            })(
              <Select style={{ width: '25%' }}>
                {formOptionList.includeList.map((item: any) => (
                  <Select.Option value={item.value} key={item.value}>
                    {item.key}
                  </Select.Option>
                ))}
              </Select>,
            )}
            {getFieldDecorator('appId.content', {
              initialValue: defaultform.appId.content || ['all'],
            })(
              <Select mode="multiple" style={{ width: '75%' }} showSearch allowClear>
                <Select.Option value="all">all</Select.Option>
                {appidlist &&
                  appidlist.map((item: any) => (
                    <Select.Option value={item} key={item}>
                      {item}
                    </Select.Option>
                  ))}
              </Select>,
            )}
            <Tag color="volcano" onClick={() => setAppidpopvisible(true)}>
              添加appid
            </Tag>
          </Form.Item>

          <Form.Item label="刷新模式">
            {getFieldDecorator('refresh_mode', {
              initialValue: defaultform.refresh_mode,
            })(
              <Select mode="multiple" showSearch allowClear>
                {formOptionList.refreshModeList.map(
                  ({ key, value }: { key: string; value: string }) => (
                    <Select.Option key={value} value={value}>
                      {key}
                    </Select.Option>
                  ),
                )}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="年龄段">
            {getFieldDecorator('age_group', {
              initialValue: defaultform.age_group,
            })(
              <Select>
                {formOptionList.ageGroupList.map((item: any) => (
                  <Select.Option value={item} key={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>

          {/* <Form.Item
            label={
              <span>
                生效服务&nbsp;
                <Tooltip title="例如：Blender,u2v,u2n,allinone,cb；多个服务中间用英文逗号隔开">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('service', {
              initialValue: defaultform.service || "",
            })(
              <Input.TextArea
                style={{ height: 80 }}
                placeholder="填写关键词请遵从提示中的添加方式"
              />,
            )}
          </Form.Item> */}
          <Form.Item label="是否仅在 -3 屏生效">
            {getFieldDecorator('minus3', {
              initialValue: defaultform.minus3,
            })(
              <Radio.Group>
                <Radio value={false}>否</Radio>
                <Radio value={true}>是</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          <Form.Item label="渠道号" extra="不包含时，内容不能为all">
            {getFieldDecorator('userRiseCS.content', {
              initialValue: defaultform.userRiseCS.content || ['all'],
            })(<Input addonBefore={userPrefixSelector} style={{ width: '100%' }} allowClear />)}
          </Form.Item>
          <Form.Item label="品牌">
            {getFieldDecorator('distribution', {
              initialValue: defaultform.distribution || ['all'],
            })(
              <Select mode="multiple">
                {formOptionList.distributionList.map((item: any) => (
                  <Select.Option value={item} key={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="用户维度">
            {getFieldDecorator('userType', {
              initialValue: defaultform.userType || 'all',
            })(
              <Select>
                {formOptionList.userTypeList.map((item: any) => (
                  <Select.Option value={item} key={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="用户分层">
            {getFieldDecorator('userLabel', {
              initialValue: defaultform.userLabel || 'all',
            })(
              <Select>
                {formOptionList.userLabelList.map((item: any) => (
                  <Select.Option value={item.value} key={item.key}>
                    {item.key}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="性别">
            {getFieldDecorator('gender', {
              initialValue: defaultform.gender || 'all',
            })(
              <Select>
                {formOptionList.genderList.map((item: any) => (
                  <Select.Option value={item} key={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="设备型号" extra="不包含时，内容不能为all">
            {getFieldDecorator('brand.content', {
              initialValue: defaultform.brand.content || 'all',
              rules: [{ required: true, message: '设备型号不能为空!' }],
            })(<Input addonBefore={brandPrefixSelector} style={{ width: '100%' }} allowClear />)}
          </Form.Item>
          <Form.Item label="城市" extra="不包含时，内容不能为all">
            {getFieldDecorator('city.include', {
              initialValue: defaultform.city.include,
              rules: [{ required: true, message: '城市不能为空!' }],
            })(
              <Select style={{ width: '25%' }}>
                {formOptionList.includeList.map((item: any) => (
                  <Select.Option value={item.value} key={item}>
                    {item.key}
                  </Select.Option>
                ))}
              </Select>,
            )}
            {getFieldDecorator('city.content', {
              initialValue: defaultform.city.content.split(',') || ['all'],
              rules: [{ required: true, message: '城市不能为空!' }],
            })(
              <Select mode="multiple" style={{ width: '75%' }} showSearch allowClear>
                <Select.Option value="all">all</Select.Option>
                {citylist &&
                  citylist.map((item: any) => (
                    <Select.Option value={item.name} key={item.name}>
                      {item.name}
                    </Select.Option>
                  ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="是否在核心城市生效">
            {getFieldDecorator('cityCore', {
              initialValue: defaultform.cityCore === undefined ? false : defaultform.cityCore,
            })(
              <Radio.Group>
                <Radio value={false}>否</Radio>
                <Radio value={true}>是</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          <Form.Item label="商圈" extra="不包含时，内容不能为all" style={{ display: 'none' }}>
            {getFieldDecorator('businessArea.content', {
              initialValue: defaultform.businessArea.content || 'all',
              rules: [{ required: true, message: '商圈不能为空!' }],
            })(<Input addonBefore={businessPrefixSelector} style={{ width: '100%' }} allowClear />)}
          </Form.Item>
          <Form.Item label="bucket" extra="不包含时，内容不能为all">
            {getFieldDecorator('bucket.content', {
              initialValue: defaultform.bucket.content || 'all',
              rules: [{ required: true, message: 'bucket不能为空!' }],
            })(<Input addonBefore={bucketPrefixSelector} style={{ width: '100%' }} allowClear />)}
          </Form.Item>
          <Form.Item label="图文过滤规则">
            {getFieldDecorator('ruleId', {
              initialValue: defaultform.ruleId || '无',
            })(
              <Select showSearch >
                <Select.Option value="无" key={'无'}>无</Select.Option>
                {newsrulelist &&
                  newsrulelist.map((item: any) => (
                    <Select.Option value={item.name} key={item}>
                      {item.idName}
                    </Select.Option>
                  ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="视频过滤规则">
            {getFieldDecorator('videoId', {
              initialValue: defaultform.videoId || '无',
            })(
              <Select showSearch >
                <Select.Option value="无">无</Select.Option>
                {videorulelist.map((item: any) => (
                  <Select.Option value={item.name} key={item.id}>
                     {item.idName}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item {...TailFormItemLayout}>
            <Button type="primary" htmlType="submit" disabled={saving}>
              保存
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};
const WrappedDemo = Form.create({ name: 'validate_other' })(AddCoverForm);
export default WrappedDemo;
