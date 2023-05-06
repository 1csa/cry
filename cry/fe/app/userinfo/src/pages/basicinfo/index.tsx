import React, { memo, useState } from 'react';
import { Input, Form, Button, message, Card } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { queryBasicInfo } from '@/services/index';
import { BasicInfoType } from '@/config/basicinfo/basicinfo.d';
import './index.less';

interface BasicInfo extends FormComponentProps {}

// 查询用户基础信息
const BasicInfoForm: React.FC<BasicInfo> = props => {
  const { getFieldDecorator, getFieldValue } = props.form;
  const [basicinfo, setBasicinfo] = useState<BasicInfoType[]>();

  const handleQueryOn = async (type: string) => {
    let uid: string = getFieldValue('uid') || '',
      phone: string = getFieldValue('phone') || '';

    if (uid.length === 0 && phone.length === 0) {
      message.error('请至少输入uid或手机号码');
      return;
    }
    if (type === 'uid') {
      phone = '';
    } else {
      uid = '';
    }

    try {
      let res = await queryBasicInfo({ userid: uid, mobile: phone });
      if (res && res.status === 'success') {
        let newBasicInfo = res.result && [res.result].flat(1);
        setBasicinfo(newBasicInfo);
      } else {
        throw new Error(res.reason);
      }
    } catch (err) {
      message.error(err.toString());
    }
  };

  return (
    <>
      <div className="basicinfo">
        <Card title="用户基础信息查询" bordered={false}>
          <Form className="form" layout="inline">
            <Form.Item label="uid">
              {getFieldDecorator('uid', {})(<Input style={{ width: 250 }} allowClear={true} />)}
            </Form.Item>
            <Button type="primary" onClick={() => handleQueryOn('uid')}>
              查询
            </Button>
          </Form>
          <Form className="form" layout="inline">
            <Form.Item label="phone">
              {getFieldDecorator('phone', {
                rules: [
                  {
                    pattern: /^\+?(86)?1\d{10}/,
                    message: '请输入正确的电话号码',
                  },
                ],
              })(<Input style={{ width: 250 }} allowClear={true} />)}
            </Form.Item>
            <Button type="primary" onClick={() => handleQueryOn('phone')}>
              查询
            </Button>
          </Form>
        </Card>
        <Card title="用户基础信息查询结果" bordered={false} style={{ marginTop: '10px' }}>
          {basicinfo &&
            basicinfo.map(({ userid, mobile, nickname, createTime }, index) => (
              <div className="info" key={index}>
                <div className="info-item">
                  <label>uid</label>
                  <div>{userid}</div>
                </div>
                <div className="info-item">
                  <label>昵称</label>
                  <div>{nickname}</div>
                </div>
                <div className="info-item">
                  <label>绑定手机号</label>
                  <div>{mobile}</div>
                </div>
                <div className="info-item">
                  <label>注册时间</label>
                  <div>{createTime}</div>
                </div>
                <div className="info-item">
                  <label>发表的评论</label>
                  <Button
                    type="link"
                    size="small"
                    href={`http://pandora.yidian-inc.com/tools/crow#!/search/userid/${userid}/all`}
                    target="_blank"
                  >
                    去看看
                  </Button>
                </div>
              </div>
            ))}
        </Card>
      </div>
    </>
  );
};

const BasicInfo = Form.create({})(BasicInfoForm);

export default memo(BasicInfo);
