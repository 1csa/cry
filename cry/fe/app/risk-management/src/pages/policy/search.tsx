import React, { FC, useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import {
  Card,
  Form,
  DatePicker,
  Input,
  Select,
  Table,
  message,
  Button,
  Icon,
  Tag,
  Badge,
} from 'antd';
import { ColumnProps } from 'antd/es/table';
import axios from 'axios';
import appConfig from '@/config/app.config';
import moment from 'moment';
import ViewPolicyDetail from '@/components/policy/viewPolicyDetail';

const { RangePicker } = DatePicker;
const { Option } = Select;

const dateFormat = 'YYYY-MM-DD';
const dateFormat2 = 'YYYY-MM-DD HH:mm';

const statusList = [
  { name: '全部', value: '' },
  { name: '正常', value: '正常', color: 'green' },
  { name: '疑似', value: '疑似', color: 'orange' },
  { name: '异常', value: '异常', color: 'volcano' },
];
const userType = [
  { name: 'userid', value: 'userid' },
  { name: 'ip', value: 'ip' },
];

interface FormProps {
  form: { getFieldDecorator: any; validateFieldsAndScroll: any; resetFields: any };
}
const FeaturePage: FC<FormProps> = (props: FormProps) => {
  const { getFieldDecorator, validateFieldsAndScroll, resetFields } = props.form;
  const [loading, setLoading] = useState<Boolean>(true);
  const [recordstatus, setRecordstatus] = useState<string>('');
  const [seachPms, setSeachPms] = useState<object>({
    startTime: moment()
      .subtract(30, 'days')
      .format(dateFormat),
    endTime: moment().format(dateFormat),
    businessCn: '',
    riskStatus: '',
    type: 'userid',
    userId: '',
    ip: '',
    offset: 0,
    limit: 200,
    ipOrId: '',
  });
  const [viewpopvisible, setViewpopvisible] = useState<Boolean>(false);
  const [viewDetail, setViewDetail] = useState<object>({});
  const [featureList, setFeatureList] = useState<Array<any>>([]);
  const [search, setSearch] = useState<Boolean>(false);
  useEffect(() => {
    getData(seachPms);
  }, [search]);

  const getData = async pms => {
    let data = Object.assign({}, pms);
    const maplist = ['userId', 'ip', 'startTime', 'endTime', 'riskStatus'];
    maplist.map(item => {
      if (data[item] === '') {
        delete data[item];
      }
    });
    delete data.type;
    delete data.ipOrId;
    const ret = await axios.post(`/api/proxy/${appConfig.API_HOST}/userBasics/list`, data);
    if (ret.data.status === 200) {
      let list = ret.data.data.list;
      setFeatureList(list);
    } else {
      message.error('失败，请重试');
    }
    setLoading(false);
  };

  const column: ColumnProps<any>[]= [
    {
      title: 'userid',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: '业务名称',
      dataIndex: 'businessName',
      key: 'businessName',
      width: 150,
      ellipsis: true,
      render: text => (text ? text : '--'),
    },
    {
      title: '调用时间',
      dataIndex: 'pDay',
      key: 'pDay',
    },
    {
      title: '风险类型',
      dataIndex: 'riskType',
      key: 'riskType',
      render: text => (text ? text : '--'),
    },
    {
      title: '来源IP',
      dataIndex: 'ips',
      key: 'ips',
      // render: (text: any) => text.map(item => (<Badge color="lime" text={item} />)),
      render: (text: any, _, index: number) => text?.map(item => <Tag color="purple" key={index}>{item}</Tag>),
    },
    {
      title: '地理位置',
      dataIndex: 'citys',
      key: 'citys',
      width: 80,
      render: text => {
        const newCities = text ? text.map((item: any) => (item ? item : '--')) : [];
        return Array.from(new Set(newCities)).join(',');
      },
    },
    {
      title: '风险状态',
      dataIndex: 'riskStatus',
      key: 'riskStatus',
      render: (text: any) => {
        let dom: any;
        statusList.map(item => {
          if (item.value && item.value === text && item.color) {
            dom = <Tag color={item.color}>{text}</Tag>;
          }
        });
        return dom;
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text: any, record: { status: string }) => {
        return (
          <div>
            <Button
              size="small"
              icon="inbox"
              style={{ marginBottom: '2px', marginRight: '5px' }}
              onClick={() => {
                viewFeatureModal(record);
              }}
            >
              查看
            </Button>
          </div>
        );
      },
    },
  ];

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    validateFieldsAndScroll((err, values) => {
      // console.log(values)
      if (!err) {
        let data = Object.assign({}, seachPms);
        const mapData = ['businessCn', 'userId', 'ip', 'riskStatus', 'type'];
        mapData.map(item => {
          data[item] = values[item];
        });
        if (values.type === 'userid') {
          data.userId = values.ipOrId;
          data.ip = '';
        } else {
          data.ip = values.ipOrId;
          data.userId = '';
        }
        setSeachPms(data);
        setSearch(!search);
      }
    });
  };
  const onChangeTime = (value, dateString) => {
    let data = Object.assign({}, seachPms);
    data.startTime = dateString[0];
    data.endTime = dateString[1];
    setSeachPms(data);
  };

  const onOkTime = value => {
    console.log('onOk: ', value);
  };

  const viewFeatureModal = async record => {
    const ret = await axios.post(`/api/proxy/${appConfig.API_HOST}/userBasics/info`, {
      id: record.id,
    });
    if (ret.data.status === 200) {
      setViewpopvisible(true);
      setRecordstatus(record.riskStatus);
      setViewDetail(ret.data.data);
    } else {
      message.error('获取详情失败，请重试');
    }
  };

  const selectBefore = getFieldDecorator('type', {
    initialValue: seachPms.type,
  })(
    <Select style={{ width: 90 }}>
      {userType.map(item => (
        <Option value={item.value} key={item.value}>
          {item.name}
        </Option>
      ))}
    </Select>,
  );
  return (
    <>
      <div className="main-content">
        <PageHeader current="风险查询" home="决策中心" />
        <Card bordered={false} style={{ minHeight: 380, marginTop: '-25px' }}>
          <Form layout="inline" onSubmit={handleSubmit} style={{ marginBottom: '10px' }}>
            <Form.Item label="调用时间">
              {getFieldDecorator('creat_time', {
                initialValue: [moment().subtract(30, 'days'), moment()],
              })(
                <RangePicker
                  format={dateFormat}
                  placeholder={['开始时间', '结束时间']}
                  onChange={onChangeTime}
                  onOk={onOkTime}
                  style={{ width: '240px' }}
                />,
              )}
            </Form.Item>
            <Form.Item label="策略名称">
              {getFieldDecorator('businessCn', {
                initialValue: seachPms.businessCn,
              })(<Input style={{ width: 180 }} placeholder="请输入策略名称" />)}
            </Form.Item>
            <Form.Item label="风险状态">
              {getFieldDecorator('riskStatus', {
                initialValue: '',
              })(
                <Select style={{ width: 100 }}>
                  {statusList.map(item => (
                    <Option value={item.value} key={item.value}>
                      {item.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
            <Form.Item label="用户查询">
              {getFieldDecorator('ipOrId', {
                initialValue: seachPms.ipOrId,
              })(<Input addonBefore={selectBefore} />)}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
            </Form.Item>
          </Form>
          <Table<any>
            size="small"
            columns={column}
            loading={loading}
            dataSource={featureList}
            rowKey={record => record.id}
          />
          <ViewPolicyDetail
            viewpopvisible={viewpopvisible}
            setViewpopvisible={setViewpopvisible}
            viewDetail={viewDetail}
            recordstatus={recordstatus}
          />
        </Card>
      </div>
    </>
  );
};
const WrappedDemo = Form.create({ name: 'validate_other' })(FeaturePage);
export default WrappedDemo;
