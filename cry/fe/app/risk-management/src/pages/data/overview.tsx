import React, { useEffect, useState } from 'react';
import { Card, Form, DatePicker, Select, Table, Divider, Button, Radio, Spin, message } from 'antd';
import moment from 'moment';
import './index.less';

import { getControls, getReportData } from '@/services/riskToIgp'
import BizOverview from '@/components/overview/biz'
import { exportExcel } from '@/utils/exportExcel'

import { rangeColumns, dayColumns } from '@/config/overview'
import PageHeader from '@/components/PageHeader';
import { changeNumToFullYear } from '@/utils/common'

const { RangePicker } = DatePicker;
const { Option } = Select;

const dateFormat = 'YYYY-MM-DD';

interface FormProps {
  form: any;
}

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}

const OverView: React.FC<FormProps> = (props) => {

  const { getFieldDecorator, getFieldValue } = props.form;


  const [loading, setLoading] = useState<boolean>(false)
  const [start_time, setStart_time] = useState('')
  const [end_time, setEnd_time] = useState('')
  // 原始数据
  const [channelCategory, setChannelCategory] = useState<any[]>([]);
  const [categoryDistributionChannel, setCategoryDistributionChannel] = useState<any[]>([]);
  const [nameDistributionChannel, setNameDistributionChannel] = useState<any[]>([]);

  // 过滤后的数据
  const [namesList, setNamesList] = useState<any[]>([]);
  const [numberList, setNumberList] = useState<any[]>([]);

  const [dataSource1, setDataSource1] = useState<any[]>([]);
  const [dataSource2, setDataSource2] = useState<any[]>([]);
  const [bizDataList, setBizDataList] = useState<any[]>([]);
  const [switchType, setSwitchType] = useState<string>('1');
  const [initNumbers, setInitNumbers] = useState<number>();


  useEffect(() => {
    initControlData()
    initDate()
  }, [])

  const initDate = () => {
    let start =  changeNumToFullYear(+moment().subtract(14, "days")._d)
    let end =  changeNumToFullYear(+moment().subtract(0, "days")._d)
    setStart_time(start)
    setEnd_time(end)
    let reqObj = [
      {
        key: "start_time",
        value: start
      },
      {
        key: "end_time",
        value: end
      }
    ]
    handleRequestData(reqObj)
  }

  const initControlData = async () => {
    const res = await getControls('/ugp/control/finds?keys=channel_category&keys=channel_category_distribution_channel&keys=channel_name_distribution_channel');

    setChannelCategory(res.data.data[0].data)
    setCategoryDistributionChannel(res.data.data[1].data)
    setNameDistributionChannel(res.data.data[2].data)


    let arr: any[] = []
    res.data.data[2].data.forEach((item: any) => {
      if (item['childSelects'] && item['childSelects'].length) {
        arr.push(...item['childSelects'])
      }
    })
    setNumberList(arr)
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();
    props.form.validateFields((err: any, values: any) => {
      if (!err) {
        let day31 = 30 * 24 * 60 * 60 * 1000 // 31天的时间间隔
        if((+new Date(end_time)) - (+new Date(start_time)) > day31) {
          message.error('日期区间不能大于31天,请重新选择')
          return false
        }
        let reqObj = [
          {
            key: "start_time",
            value: start_time
          },
          {
            key: "end_time",
            value: end_time
          },
          {
            key: "channel_category",
            value: values['channel_category'] && values['channel_category'].length ? values['channel_category'] : ''
          },
          {
            key: "channel_name",
            value: values['channel_name'] && values['channel_name'].length ? values['channel_name'] : ''
          },
          {
            key: "distribution_channel",
            value: values['distribution_channel'] && values['distribution_channel'].length ? values['distribution_channel'].map((item: string) => {
              return item.split('-')[1]
            }) : ''
          }
        ]
        reqObj = reqObj.filter(item => {
          return !!item['value']
        })
        handleRequestData(reqObj)
      }
    });
  };

  const handleRequestData = async (obj: any) => {
    setLoading(true)
    const res1 = await getReportData({
      reportKey: 'risk_control_report_new_user',
      queryData: obj,
    })
    const res2 = await getReportData({
      reportKey: 'risk_control_dashboard_ranges',
      queryData: obj,
    })
    const res3 = await getReportData({
      reportKey: 'risk_control_datshboard_days',
      queryData: obj,
    })
    const res4 = await getReportData({
      reportKey: 'risk_control_datshboard_chat',
      queryData: obj,
    })
    setDataSource1(res2.data.data.data.map((item: any, index: number) => {
      item['key'] = index
      // item['drop_normal_online_time'] = item['drop_normal_online_time'] ? `${item['drop_normal_online_time']}`.replace(/(?!^)(?=(\d{3})+$)/g, ',') : ''
      item['avg_cost'] = item['avg_cost'] ? item['avg_cost'].toFixed(2) : ''
      item['total_cost'] = item['total_cost'] ? item['total_cost'].toFixed(2) : ''
      item['new_user_liucun1'] = item['new_user_liucun1'] ? (item['new_user_liucun1'] * 100).toFixed(2) + '%' : ''
      item['drop_abnormal_user_liucun1'] = item['drop_abnormal_user_liucun1'] ? (item['drop_abnormal_user_liucun1'] * 100).toFixed(2) + '%' : ''
      return item
    }))
    setDataSource2(res3.data.data.data.map((item: any, index: number) => {
      item['key'] = index
      // item['drop_normal_online_time'] = item['drop_normal_online_time'] ? `${item['drop_normal_online_time']}`.replace(/(?!^)(?=(\d{3})+$)/g, ',') : ''
      item['avg_cost'] = item['avg_cost'] ? item['avg_cost'].toFixed(2) : ''
      item['total_cost'] = item['total_cost'] ? item['total_cost'].toFixed(2) : ''
      item['new_user_liucun1'] = item['new_user_liucun1'] ? (item['new_user_liucun1'] * 100).toFixed(2) + '%' : ''
      item['drop_abnormal_user_liucun1'] = item['drop_abnormal_user_liucun1'] ? (item['drop_abnormal_user_liucun1'] * 100).toFixed(2) + '%' : ''
      return item
    }))
    let bizArr: any[] = []
    res4.data.data.data.forEach((item: any) => {
      bizArr.push({
        p_day: item['p_day'],
        type: '黑',
        value: item['abnormal_user'],
      })
      bizArr.push({
        p_day: item['p_day'],
        type: '白',
        value: item['normal_user_white'],
      })
      bizArr.push({
        p_day: item['p_day'],
        type: '灰',
        value: item['suspect_user'],
      })
    })
    setBizDataList(bizArr)
    if (res1.data.data.data.length) {
      setInitNumbers(res1.data.data.data[0].new_user)
    }
    setLoading(false)
  }

  const onChangeTime = (value: any, dateString: string[]) => {
    setStart_time(dateString[0])
    setEnd_time(dateString[1])
  }
  
  const typeChange = (v: string[]) => {
    let arr: any[] = []
    channelCategory.forEach(item => {
      if(v.includes(item['id'])) {
        arr.push(...item['childSelects'])
      }
    })
    setNamesList(arr)
  }

  const nameChange = (v: string[]) => {
    // let arr1: any[] = []
    let arr2: any[] = []
    let formItemChannelCategoryValue = getFieldValue('channel_category')
    if (v.length === 0) {
      nameDistributionChannel.forEach(item => {
        if (item['childSelects'] && item['childSelects'].length) {
          arr2.push(...item['childSelects'])
        }
      })
    } else {
      nameDistributionChannel.forEach(item => {
        if(v.includes(item['id']) && formItemChannelCategoryValue.includes(item['parentId'])) {
          if (item['childSelects'] && item['childSelects'].length) {
            arr2.push(...item['childSelects'])
          }
        }
      })
    }
    setNumberList(arr2)
  }

  const onRadioChange = (v: any) => {
    setSwitchType(v.target.value)
  }

  const handleExport = () => {
    if (switchType === '1') {
      exportExcel(rangeColumns, dataSource1, `${start_time}至${end_time}-按区间`)
    } else {
      exportExcel(dayColumns, dataSource2, `${start_time}至${end_time}-按天`)
    }
  }

  return (
    <div className="main-content">
      <PageHeader current="数据概览" home="数据中心"/>
      <Card bordered={false} style={{ minHeight: 380 , marginTop: '-25px'}}>
        <Form
          layout="inline"
          onSubmit={handleSubmit}
          style={{marginBottom: '10px'}}
          labelAlign="left"
        >
          <Form.Item label="选择日期" {...formLayout} className="mustFormCtn">
            {getFieldDecorator('creat_time', {
              initialValue: [moment().subtract(14, "days"), moment()],
              rules: [
                {
                  required: true,
                  message: '请选择日期!',
                },
              ],
            })(
              <RangePicker
                format={dateFormat}
                placeholder={['开始时间', '结束时间']}
                onChange={onChangeTime}
                style={{width: '224px'}}
              />
            )}
          </Form.Item>
          <Form.Item label="渠道类型" {...formLayout}>
            {getFieldDecorator('channel_category', {
              // initialValue: seachPms.level1Type,
            })(
              <Select
                mode="multiple"
                showSearch
                style={{width: 224}}
                placeholder="全部"
                onChange={typeChange}
              >
                {channelCategory.map(item => <Option value={item.id} key={item.id}>{item.name}</Option>)}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="渠道名称" {...formLayout}>
            {getFieldDecorator('channel_name', {
              // initialValue: seachPms.level2Type,
            })(
              <Select
                mode="multiple"
                showSearch
                onChange={nameChange}
                style={{width: 224}} placeholder="全部">
                  {namesList && namesList.map(item => {
                    return <Option value={item.id} key={item.id}>{item.name}</Option>
                  })}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="渠道号" {...formLayout}>
            {getFieldDecorator('distribution_channel', {
              // initialValue: seachPms.level2Type,
            })(
              <Select
                mode="multiple"
                showSearch
                style={{width: 224}} placeholder="全部">
                {numberList.map((item, index) => {
                  // 前面加 index 是因为 item.id 可能重复 加上index就变成唯一了
                  return <Option value={`${index}-${item.id}`} key={`${index}-${item.id}`}>{item.name}</Option>
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">搜索</Button>
          </Form.Item>
        </Form>
        <Divider />
        <div style={{ marginBottom: '20px' }}>
          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>设备初始状态激活趋势图</span>
          {/* <span style={{ marginLeft: '20px' }}>{end_time} 初始激活: */}
          {/* <span style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 10px' }}>{initNumbers || '--'}</span>人</span> */}
        </div>
        <Spin spinning={loading}>
          <BizOverview dataList={bizDataList} />
        </Spin>
        <Divider />
        <Radio.Group defaultValue="1" onChange={onRadioChange}>
          <Radio.Button value="1">按区间</Radio.Button>
          <Radio.Button value="2">按天</Radio.Button>
        </Radio.Group>
        <Button type="link" style={{float: 'right'}} onClick={handleExport}>
          导出
        </Button>
        {
          switchType === '1' ?
          <Table
            scroll={{ x: 1550 }}
            dataSource={dataSource1}
            columns={rangeColumns}
            pagination={{ showSizeChanger: true }} 
          /> :
          <Table
            scroll={{ x: 1650 }}
            dataSource={dataSource2}
            columns={dayColumns}
            pagination={{ showSizeChanger: true }} 
          />
        }
      </Card>
    </div>
  );
};

const OverViewDemo = Form.create({ name: 'validate_other11' })(OverView);
export default OverViewDemo;
