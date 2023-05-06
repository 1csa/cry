import React, { FC, useState, useEffect } from 'react';
import {
  Card,
  Table,
  message,
  Button,
  Input,
  Form,
  Select,
  DatePicker,
  Tooltip,
  Icon,
  Button
} from 'antd';

import request from '@/utils/request';
import moment from 'moment';
import LogModal from '@/components/logsModal/logsModal'
const dateFormat = 'YYYY-MM-DD';
const dateFormat2 = 'YYYY-MM-DD HH:mm:ss';
const selectList = [
  {
    name: '过滤策略覆盖用户设置',
    value: 'usercoverconditions',
  },{
    name: '图文过滤规则',
    value: 'graphicpurification',
  },{
    name: '视频过滤规则',
    value: 'videopurification',
  },{
    name: '图文过滤阈值',
    value: 'graphicthreshold',
  },{
    name: '视频过滤阈值',
    value: 'videothreshold',
  },
]
const actionList = [
  {
    name: '全部',
    value: 'all',
  },{
    name: '保存',
    value: 'save',
  },{
    name: '删除',
    value: 'delete',
  },
]

interface FormProps {
  form: { getFieldDecorator: any; validateFieldsAndScroll: any; resetFields: any};
}
const OpLogs: FC<FormProps> = (props: FormProps) => {
  const { getFieldDecorator, validateFieldsAndScroll, resetFields } = props.form;
  const [loglist, setLoglist] = useState<any[]>([]);
  const [search, setSearch] = useState<boolean>(false);
  const [loading, setLoading] = useState<Boolean>(true);
  const [modal, setModal] = useState<boolean>(false);
  const [logItem, setLogItem] = useState<any[]>([]);
  const [seachPms, setSeachPms] = useState<object>({
    domain: 'unitool',
    sort: 'timestamp:-1',
    key: 'usercoverconditions',
    start: 0,
    end: 1000,
    start_date: moment().subtract(30, "days").format(dateFormat),
    end_date: moment().format(dateFormat),
    action: '',
    value: '',
  });
  const column = [{
    title: '时间',
    dataIndex: 'timestamp',
    key: 'timestamp',
    width: 180,
    render: (text: any) => moment(text*1000).format(dateFormat2),
  }, {
    title: '执行操作',
    dataIndex: 'action',
    key: 'action',
    width: 80,
    filters: [
      {
        text: '删除',
        value: 'delete',
      },
      {
        text: '保存',
        value: 'save',
      },
    ],
    onFilter: (value: any, record: { env: string | any[], action: any[] }) => record.action.indexOf(value) === 0,
    render: (text: any) => actionList.map( item => {
      if (item.value === text) {
        return item.name
      }
    }),
  }, {
    title: '操作内容',
    dataIndex: 'value',
    key: 'value',
    onCell: () => {
      return {
        style: {
          maxWidth: 250,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow:'ellipsis',
          cursor:'pointer'
        }
      }
    },
  }, {
    title: '操作人',
    dataIndex: 'nickname',
    key: 'nickname',
  }, {
    title: '操作',
    dataIndex: 'detailAction',
    key: 'detailAction',
    render: (text:any, record:any) => {
      return <Button type="primary"
      onClick={() => {
        // for(let i = 1; i < record.value.length; i=i+200) {
        //   record.value.slice
        // }
        setLogItem(record)
        setModal(true)
      }}>查看详情</Button>
    }
  }];

  useEffect(() =>{
    getAllLogs();
  },[search]);

  const getAllLogs = async() => {
    seachPms.start_date = moment(seachPms.start_date).format(dateFormat);
    seachPms.end_date = moment(seachPms.end_date).format(dateFormat);
    const ret = await request.get('/api/filtertools/getLogs', {
      params: seachPms
    });
    if (ret.code === 0 && ret.result) {
      let resultData:any[] = [];
      if (seachPms.value !== '') {
        ret.result.map( (item, index) => {
          if (item.value.includes(seachPms.value) || item.nickname === seachPms.value) {
            resultData.push(item)
          }
        })
      } else {
        resultData = resultData.concat(ret.result)
      }
      setLoglist(resultData);
      setLoading(false);
    } else {
      message.error(`获取日志列表失败,${'原因: '+ ret.message ? ret.message : ''}`);
      setLoading(false);
    }
  }
  const handleSubmit = (e:any) => {
    console.log('e');
    e.preventDefault();
    setLoading(true);
    validateFieldsAndScroll((err: any, values:object) => {
      if (!err) {
        let keys = Object.keys(values);
        keys.map(item => {
          seachPms[item] = values[item]
        })
        setSearch(!search);
      }
    });
  }
  return (
    <>
      <div className="main-content">
        <Card bordered={false} style={{ minHeight: 380 }}>
          <h4 style={{marginBottom: '10px'}}>
            操作日志：共 <font style={{color: '#1890ff'}}>{loglist.length}</font> 条数据
            <Tooltip title="还可以通过静态日志工具查询，地址为：http://pandora.yidian-inc.com/tools/statistic?domain=unitool">
              <Icon type="exclamation-circle" style={{ fontSize: 12, marginLeft: '4px' }}/>
            </Tooltip>
          </h4>
          <Form layout="inline" onSubmit={handleSubmit} style={{marginBottom: '10px'}}>
            <Form.Item label="日志表格">
              {getFieldDecorator('key', {
                initialValue: seachPms.key,
              })(
                <Select style={{width: 180}}>
                  {selectList.map(item => <Select.Option value={item.value}>{item.name}</Select.Option>)}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="关键字">
              {getFieldDecorator('value', {
                initialValue: seachPms.value,
              })(
                <Input style={{width: 100}}/>
              )}
            </Form.Item>
            <Form.Item label="开始时间">
              {getFieldDecorator('start_date', {
                initialValue: moment(seachPms.start_date),
              })(
                <DatePicker format={dateFormat} showTime/>
              )}
            </Form.Item>
            <Form.Item label="结束时间">
              {getFieldDecorator('end_date', {
                initialValue: moment(seachPms.end_date),
              })(
                <DatePicker format={dateFormat} showTime/>
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </Form.Item>
          </Form>
          <Table
            columns={column}
            loading = {loading}
            dataSource={loglist}
            rowKey={record => record.index}
          />
        </Card>
        <LogModal
          modalFlag={modal}
          logList={logItem}
          setModal={setModal}
          moment={moment}
        />
      </div>
    </>
  );
};
const WrappedDemo = Form.create({ name: 'validate_other' })(OpLogs);
export default WrappedDemo;
