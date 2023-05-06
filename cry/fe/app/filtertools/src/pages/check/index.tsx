import React, { FC, useCallback, useState, useEffect, useRef } from 'react';
import {
  Card,
  Table,
  message,
  Button,
  Select,
  Form,
  Input,
  InputNumber,
} from 'antd';
import axios from 'axios';
import { CheckFormOptionList } from '@/config/constant';
import { getIsDev } from '@/utils/get_dev';
import { connect } from 'dva';
import './index.less'

const isDev = getIsDev();
const defaultFormValue = CheckFormOptionList;
const { Search } = Input;
interface CheckProps {
  form: { getFieldDecorator: any; validateFieldsAndScroll: any; resetFields: any };
}
const Check: FC<CheckProps> = (props: CheckProps) => {
  const [list, setList] = useState<any[]>([]);
  const [value, setvalue] = useState<Object>({});
  const { getFieldDecorator, validateFieldsAndScroll, resetFields } = props.form;
  const [loading, setLoading] = useState<Boolean>(false);
  const [isBlock, setIsBlock] = useState<Boolean>(false);

  const hanSearch = () => {
    validateFieldsAndScroll((err:any, values:any) => {
      setvalue(values)
      if (values.docids) {
        setLoading(true)
        // 544231975
        axios.get('/api/proxy/http://www.qatool.yidian-inc.com:8089/jeecg-boot/test/qatoolDemo/queryRulesById', {
          params: {
            ...values
          }
        }).then(res => {
          if (res.data.code === 0) {
            setList(res.data.result ? res.data.result : [])
            message.success(res.data.message);
          } else {
            message.error('查询内容为空');
          }
          setLoading(false)
        })
      } else {
        message.error('请输入要查询的doc_id')
      }
    });
  }
  const reset = () => {
    resetFields()
    setList([])
  }
  const isShowForm = () => {
    setIsBlock(!isBlock)
  }

  const getValue = (str: string, key: string) => {
    let result = new RegExp(`(?:^|,)${key}:([^#]*)`).exec(str);
    return result && result[1]
  }

  //  775677682
  const columns = [
    {
      title: '文章ID',
      dataIndex: 'docId',
      key: 'docId',
      width: '14%',
    },
    {
      title: '是否过滤',
      dataIndex: 'isFiltered',
      key: 'isFiltered',
      width: '10%',
    },
    {
      title: '规则ID',
      dataIndex: 'ruleId',
      width: '14%',
      key: 'ruleId',
    },
    {
      title: '规则名称',
      dataIndex: 'ruleName',
      width: '11%',
      key: 'ruleName',
      render: (text: any, record: any) => {
        return (
          <a
            style={{ textDecoration: 'none', color: 'rgb(92, 91, 91)' }}
            href={value.docids.substring(0, 1) == 0 ? `/app/filtertools/rule/news?ruleName=${text}` : `/app/filtertools/rule/video?ruleName=${text}`}
          >{text}</a>
        )
      },
    },
    {
      title: '不命中/命中规则的原因',
      dataIndex: 'reason',
      width: '30%',
      key: 'reason',
    },
    {
      title: '覆盖描述',
      dataIndex: 'groupDesc',
      width: '30%',
      key: 'groupDesc',
      render: (text: any, record: any) => {
        return (
          <a
            style={{ textDecoration: 'none', color: 'rgb(92, 91, 91)' }}
            href={`/app/filtertools/usercover?groupId=${getValue(text, '#groupId')}`}
          >{text}</a>
        )
      },

    }
  ];
  return (
      <div className="main-check">
        <Card bordered={false} style={{ minHeight: 380 }}>
          <Form layout="inline" style={{ margin: '10px auto',maxWidth: 900 }}>
            <Form.Item label="docIds"
              style={{ margin: 8 }}
            >
              {getFieldDecorator('docids', {
                initialValue: '',
                rules: [
                  { required: true, message: '不能为空' }
                ]
              })(
                <Input placeholder='请输入docId多个用,分隔' style={{ width: 180 }} />
              )}
            </Form.Item>
            <Form.Item label="频道"
              style={{ margin: 8 }}

            >
              {getFieldDecorator('fromid', {
                initialValue: '',
              })(
                <Input placeholder='请输入频道' style={{ width: 180 }} />
              )}
            </Form.Item>
            <Form.Item label="CityCore"
              style={{ margin: 8 }}

            >
              {getFieldDecorator('cityCore', {
                initialValue: '',
              })(
                <Select style={{ width: 180 }} placeholder='只在频道为kv/knn时有效'>
                  <Select.Option value='true'>true</Select.Option>
                  <Select.Option value='false'>false</Select.Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item label="appid"
              style={{ margin: 8 }}

            >
              {getFieldDecorator('appid', {
                initialValue: '',
              })(
                <Input placeholder='请输入appid' style={{ width: 180 }} />
              )}
            </Form.Item>
            <Form.Item label="用户id"
              style={{ margin: 8 }}

            >
              {getFieldDecorator('userid', {
                initialValue: '',
              })(
                <Input placeholder='请输入用户id' style={{ width: 180 }} />
              )}
            </Form.Item>
            <Form.Item label="激活天数"
              style={{ margin: 8 }}

            >
              {getFieldDecorator('activation_days', {
                initialValue: '',
              })(
                <InputNumber placeholder='如果有userId则从画像里取' style={{ width: 180 }} step={1} />
              )}
            </Form.Item>
            <div className="hot-box" style={{ display: isBlock ? 'flex' : 'none' }}>
              <Form.Item label="city"
                style={{ margin: 8 }}

              >
                {getFieldDecorator('city', {
                  initialValue: '',
                })(
                  <Input placeholder='城市逗号分隔北京,郑州' style={{ width: 180 }} />
                )}
              </Form.Item>
              <Form.Item label="设备型号"
                style={{ margin: 8 }}

              >
                {getFieldDecorator('model', {
                  initialValue: '',
                })(
                  <Input placeholder='手机设备型号' style={{ width: 180 }} />
                )}
              </Form.Item>
              <Form.Item label="bucket"
                style={{ margin: 8 }}

              >
                {getFieldDecorator('bucket', {
                  initialValue: '',
                })(
                  <Input placeholder='可传多个如app-exp1，app-exp2' style={{ width: 180 }} />
                )}
              </Form.Item>
              <Form.Item label="图文规则ID"
                style={{ margin: 8 }}

              >
                {getFieldDecorator('useNewsRuleIds', {
                  initialValue: '',
                })(
                  <Input placeholder='要查询的图文规则Id 用,分隔' style={{ width: 180 }} />
                )}
              </Form.Item>
              <Form.Item label="视频规则ID"
                style={{ margin: 8 }}

              >
                {getFieldDecorator('useVideoRuleIds', {
                  initialValue: '',
                })(
                  <Input placeholder='要查询的视频规则Id 用,分隔' style={{ width: 180 }} />
                )}
              </Form.Item>
              <Form.Item label="配置"
                style={{ margin: 8 }}

              >
                {getFieldDecorator('fcSystem', {
                  initialValue: '',
                })(
                  <Select style={{ width: 180 }} placeholder='请选择使用哪个服务的配置'>
                    {defaultFormValue.CheckConfig.map(item => <Select.Option value={item.value}>{item.key}</Select.Option>)}
                  </Select>
                )}
              </Form.Item> <br />
            </div>
            <div className="button-list">
              <Button type="primary" onClick={() => hanSearch()}>
                查询
              </Button>
              <Button onClick={() => reset()}>
                重置
              </Button>
              <Button className="pack" onClick={() => isShowForm()}>{isBlock ? '收起':'展开'}</Button>
            </div>
          </Form>

          <h4 style={{ marginBottom: '20px' }}>
            过滤出 ： <span style={{ color: '#1890ff' }}>{list.length}</span> 条文章
          </h4>
          <Table
            columns={columns}
            loading={loading}
            dataSource={list}
          />
        </Card>
      </div>
  );
};
const CheckDemo = Form.create({ name: 'Check_other' })(Check);
export default connect(({ rule }) => ({
  rule
}))(CheckDemo);
