import React, { FC, useState, useEffect } from 'react';
import moment from 'moment';

import { Card, Button, Form, Input, Table, Tag, DatePicker, message, Select } from 'antd';

import { getTaskHistory } from '../../services/knnAutomation';

import './index.less';
interface Props {
  form: { getFieldDecorator: any; validateFieldsAndScroll: any; resetFields: any };
}
import { Select } from 'antd';

const { Option } = Select;
const BuildstatusSet = {
  QUEUE: {
    tag: 'QUEUE',
  },
  ERROR: {
    tag: <Tag color="#f50">ERROR</Tag>,
  },
  COMPLETE: {
    tag: 'COMPLETE',
  },
  ABORT: {
    tag: <Tag color="rgb(228, 139, 22)">ABORT</Tag>,
  },
  RUNNING: {
    tag: 'RUNNING',
  },
};

const Building: FC<Props> = (props: Props) => {
  const { getFieldDecorator, validateFieldsAndScroll, resetFields } = props.form;
  const [loading, setLoading] = useState<boolean>(true);
  const [queryList, setQueryList] = useState<any>([]);
  const [dateStringTime, setDateStringTime] = useState<any>([]);

  useEffect(() => {
    handGetQueryList();
  }, []);

  const handGetQueryList = async () => {
    let res: any = await getTaskHistory({
      params: {
        libType: 'big',
      },
    });
    if (res.success == true) {
      setQueryList(res.data);
      setLoading(false);
      message.info('请求成功');
    } else {
      message.error('请求失败');
    }
  };

  const handTime = (value, dateString) => {
    setDateStringTime(dateString);
  };
  const handClickBuild = async () => {
    setLoading(true);
    validateFieldsAndScroll(async (err: any, values: any) => {
      let res: any = await getTaskHistory({ params: { ...values, beginDate: dateStringTime[0], endDate: dateStringTime[1] } });
      if (res.success == true) {
        setQueryList(res.data);
        setLoading(false);
        message.info('查询成功');
      } else {
        message.error('查询失败');
      }
    });
  };

  const columns = [
    {
      title: 'type',
      key: 'type',
      dataIndex: 'type',
    },
    {
      title: '构建状态',
      key: 'buildStatus',
      dataIndex: 'buildStatus',
      filters: [
        {
          text: 'QUEUE',
          value: 'QUEUE',
        },
        {
          text: 'RUNNING',
          value: 'RUNNING',
        },
        {
          text: 'COMPLETE',
          value: 'COMPLETE',
        },
        {
          text: 'ABORT',
          value: 'ABORT',
        },
        {
          text: 'ERROR',
          value: 'ERROR',
        },
      ],
      onFilter: (value: any, record: any) => record.buildStatus.indexOf(value) === 0,
      sortDirections: ['descend'],
      render: (status: string) => {
        const renderStatus = BuildstatusSet[status];
        return renderStatus ? <span>{renderStatus.tag}</span> : status;
      },
    },
    {
      title: '数据量',
      key: 'dataNum',
      dataIndex: 'dataNum',
    },
    {
      title: 'libType',
      key: 'libType',
      dataIndex: 'libType',
    },
    // {
    //   title: 'sourceDataType',
    //   key: 'sourceDataType',
    //   dataIndex: 'sourceDataType',
    //   width: 140,
    // },
    {
      title: 'morpheus集群',
      key: 'sourceClusterName',
      dataIndex: 'sourceClusterName',
    },
    {
      title: 'morpheus表',
      key: 'sourceTableName',
      dataIndex: 'sourceTableName',
    },
    {
      title: 'days',
      key: 'days',
      dataIndex: 'days',
    },
    {
      title: 'targetIp',
      key: 'buildIp',
      dataIndex: 'buildIp',
    },
    {
      title: 'sourceData',
      key: 'sourceData',
      dataIndex: 'sourceData',
    },
    {
      title: '开始时间',
      key: 'startTime',
      dataIndex: 'startTime',
      render: (text: number, row: any) => {
        return moment(text).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: '结束时间',
      key: 'completeTime',
      dataIndex: 'completeTime',
    },
    {
      title: '异常原因',
      key: 'statusInfo',
      dataIndex: 'statusInfo',
    },
  ];

  return (
    <div className="Building">
      <Card bordered={false} className="Building-Card">
        <Form layout="inline" style={{ paddingLeft: '5%' }}>
          <Form.Item label="knn 库名">
            {getFieldDecorator('type', {
              initialValue: '',
            })(<Input placeholder="请输入knn 库名" style={{ width: 150 }} />)}
          </Form.Item>
          <Form.Item label="大小库">
            {getFieldDecorator('libType', {
              initialValue: 'big',
            })(
              <Select style={{ width: 80 }}>
                <Option value="big">big</Option>
                <Option value="small">small</Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="时间选择" style={{ marginLeft: 10 }}>
            <DatePicker.RangePicker onChange={handTime} showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
          <Button style={{ marginTop: 4 }} type="primary" icon="search" onClick={handClickBuild}>
            搜索
          </Button>
        </Form>
        <div style={{ marginTop: 10 }}>
          <Table columns={columns} dataSource={queryList} loading={loading} scroll={{ x: 1500 }} />
        </div>
      </Card>
    </div>
  );
};

export default Form.create()(Building);
