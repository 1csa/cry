import React, { FC, useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import SpSelect from '@/components/common/spSelect';
import moment from 'moment';
import { Card, Form, Button, Select, Input, DatePicker, Tooltip, Icon, Table, Collapse, message } from 'antd';
import { connect } from 'dva'
import { exportExcel } from '@/utils/makeExcel';
import { getCumLative, getUserData, getCostData, getTopData } from "@/services/risk";
import { changeNumToFloag } from '@/utils/common'
const echarts = require('echarts');

import './index.less'

const { Panel } = Collapse;
const { Option } = Select; 
const { RangePicker } = DatePicker;

interface deviceTypeSubItem {
  cnValue: string
  id: number
  type?: string
  value: string
}

interface currnetProps {
  form: any,
  deviceType: deviceTypeSubItem[],
  activeNameList: deviceTypeSubItem[]
}

interface requestParas1 {
  "appId": string,
  "startTime": string,
  "endTime": string,
  "isAll": boolean,
  "intervalType": string,
  "activeId"?: string
}

interface cumulativeTypes {
  cheatUserCount: number,
  frozenWalletUserCount: number
  lossCost: number
  userCount: number
  withdrawalFailCost: number
  withdrawalSuccessCost: number,
}

interface topItem {
  key: string,
  value: number
}

interface keyValue {
  key: string,
  value: string
}

const topNum = [
  14, // 用户收入金额
  36, // 用户提现成功金额
  16, // 用户提现请求次数
  18, // ip收入金额
  37, // ip提现成功金额
  17, // ip提现请求次数
  19 // ip参与用户数
]

const topConfig = [
  {
    ip: 14,
    name: '用户收入金额top10'
  },
  {
    ip: 36,
    name: '用户提现成功金额top10'
  },
  {
    ip: 16,
    name: '用户提现请求次数top10'
  },
  {
    ip: 18,
    name: 'ip收入金额top10'
  },
  {
    ip: 37,
    name: 'ip提现成功金额top10'
  },
  {
    ip: 17,
    name: 'ip提现请求次数top10'
  },
  {
    ip: 19,
    name: 'ip参与用户数top10'
  },
]

const ActivityData: FC<currnetProps> = (props:currnetProps) => {
  const { deviceType, activeNameList } = props
  const { getFieldDecorator, validateFieldsAndScroll, resetFields } = props.form;

  const [startTime, setStartTime] = useState<string>('')
  const [endTime, setEndTime] = useState<string>('')
  const [intervalType, setIntervalType] = useState<string>('day')
  const [isAllValue, setIsAllValue] = useState<string>('1')
  const [deviceType2, setDeviceType2] = useState<string>('')
  // const [topTime, setTopTime] = useState(moment('2021-01-01', 'YYYY-MM-DD'))
  const [topTime, setTopTime] = useState<any>('')
  const [topActivityId, setTopActivityId] = useState<string>('')
  const [userTableData, setUserTableData] = useState<object[]>([])
  const [moneyTableData, setMoneyTableData] = useState<object[]>([])
  const [topTableArr, setTopTableArr] = useState<any[]>([])
  const [activityListData, setActivityListData] = useState<keyValue[]>([])
  // 总体指标
  const [cumulative, setCumulative] = useState<cumulativeTypes>({
    cheatUserCount: 0,
    frozenWalletUserCount: 0,
    lossCost: 0,
    userCount: 0,
    withdrawalFailCost: 0,
    withdrawalSuccessCost: 0
  })
  useEffect(() => {
    validateFieldsAndScroll((err: any, values: any) => {
      const obj:requestParas1 = {
        appId: values.appId, // 应用业务线
        startTime: startTime, // 开始时间
        endTime: endTime, // 结束时间
        isAll: values.isAll === '1' ? true : false, // 是否全部
        intervalType: values.intervalType, // 时间间隔
        activeId: isAllValue === '1' ? '' : values.activeId // 活动id
      }
      const onlyObj = removeEmptyKeyFromObj(obj)
      searchAll(onlyObj)
      // searchCumLative(onlyObj)
      // searchUserData(onlyObj)
      // searchCostData(onlyObj)
    });
    // initTopDate()
    // console.log(activeNameList)
    handlesetActivityListData(activeNameList)
  }, [])

  const handleReSetFields = () => {
    setIsAllValue('1')
    resetFields()
    setStartTime('')
    setEndTime('')
  }

  const handlesetActivityListData = (arr: any) => {
    let result:keyValue[] = []
    activeNameList.forEach(item => {
      result.push({
        key: item.value,
        value: item.cnValue
      })
    })
    setActivityListData(result)
  }

  const initTopDate = () => {
    const date = new Date()
    let year = date.getFullYear()
    let month: number | string = date.getMonth() + 1 
    let day: number | string = date.getDate() - 1 // 前一天
    month = month < 10 ? '0' + month : month
    day = day < 10 ? '0' + day : day 
    const str = `${year}-${month}-${day}`
    setTopTime(moment(str, 'YYYY-MM-DD'))
  }

  const removeEmptyKeyFromObj = (obj: Object) => {
    const current = JSON.parse(JSON.stringify(obj))
    Object.keys(current).forEach(item => {
      if (current[item] === '') {
        delete current[item]
      }
    })
    return current
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // setLoading(true);
    validateFieldsAndScroll((err: any, values: any) => {
      const obj:requestParas1 = {
        appId: values.appId, // 应用业务线
        startTime: startTime, // 开始时间
        endTime: endTime, // 结束时间
        isAll: values.isAll === '1' ? true : false, // 是否全部
        intervalType: values.intervalType, // 时间间隔
        activeId: isAllValue === '1' ? '' : values.activeId // 活动id
      }
      const onlyObj = removeEmptyKeyFromObj(obj)
      searchAll(onlyObj)
      // searchCumLative(onlyObj)
      // searchUserData(onlyObj)
      // searchCostData(onlyObj)
    });
  }

  const checkHaveNoData = (obj: any):boolean => {
    let flag = false
    Object.keys(obj).forEach(item => {
      console.log(obj[item])
      if (obj[item]) {
        flag = true
      }
    })
    return flag
  }

  const searchAll = async (obj:requestParas1) => {
    let flag = false
    // 总体指标
    const res1 = await getCumLative(obj)
    if (res1.data.status === 200) {
      setCumulative(res1.data.data)
      flag = checkHaveNoData(res1.data.data)
    }

    // 用户数据
    const res2 = await getUserData(obj)
    if (res2.data.status === 200) {
      drawUserData(res2)
      if (res2.data.data.length !== 0) {
        flag = true
      }
    }

    // 资金数据
    const res3 = await getCostData(obj)
    if (res3.data.status === 200) {
      drawCostData(res3)
      if (res3.data.data.length !== 0) {
        flag = true
      }
    }
    if (!flag) {
      message.warning('该段时间无数据')
    }
  }

  const drawUserData = (res: any) => {
    const _data = JSON.parse(JSON.stringify(res.data.data))
    setUserTableData(_data)
    let obj = {}
    let data: any[] = res.data.data
    data = data.reverse()
    let timeKey:string[] = []
    let cheatUserCount: number[] = []
    let frozenWalletUserCount:number[] = []
    let userCount: number[] = []
    let withdrawalFailUser:number[] = []
    let withdrawalSuccessUser:number[] = []
    data.forEach( item => {
      timeKey.push(item.timeKey)
      cheatUserCount.push(item.cheatUserCount)
      frozenWalletUserCount.push(item.frozenWalletUserCount)
      userCount.push(item.userCount)
      withdrawalFailUser.push(item.withdrawalFailUser)
      withdrawalSuccessUser.push(item.withdrawalSuccessUser)
    })
    drawUser({timeKey, cheatUserCount, frozenWalletUserCount, userCount, withdrawalFailUser, withdrawalSuccessUser})
  }

  const drawCostData = (res: any) => {
    let originData: any[] = res.data.data
    originData.forEach(item => {
      item['incomeCost'] = changeNumToFloag(item['incomeCost'])
      item['lossCost'] = changeNumToFloag(item['lossCost'])
      item['withdrawalFailCost'] = changeNumToFloag(item['withdrawalFailCost'])
      item['withdrawalSuccessCost'] = changeNumToFloag(item['withdrawalSuccessCost'])
    })
    // let _data = JSON.parse(JSON.stringify(res.data.data))
    let _data = JSON.parse(JSON.stringify(originData))
    setMoneyTableData(_data)
    let obj = {}
    let data: any[] = originData
    data.reverse()
    let timeKey:string[] = []
    let incomeCost: number[] = []
    let lossCost: number[] = []
    let withdrawalFailCost: number[] = []
    let withdrawalSuccessCost: number[] = []
    data.forEach( item => {
      timeKey.push(item.timeKey)
      incomeCost.push(item.incomeCost)
      lossCost.push(item.lossCost)
      withdrawalFailCost.push(item.withdrawalFailCost)
      withdrawalSuccessCost.push(item.withdrawalSuccessCost)
    })
    drawMoney({ timeKey, incomeCost, lossCost, withdrawalFailCost, withdrawalSuccessCost })
  }

  const moneyColumns = [
    {
      title: '日期',
      dataIndex: 'timeKey',
      key: 'timeKey',
    },
    {
      title: '用户收入总金额',
      dataIndex: 'incomeCost',
      key: 'incomeCost',
    },
    {
      title: '提现成功金额',
      dataIndex: 'withdrawalSuccessCost',
      key: 'withdrawalSuccessCost',
    },
    {
      title: '提现失败金额',
      dataIndex: 'withdrawalFailCost',
      key: 'withdrawalFailCost',
    },
    {
      title: '拦截流失资金',
      dataIndex: 'lossCost',
      key: 'lossCost',
    },
  ];
  const userColumns = [
    {
      title: '日期',
      dataIndex: 'timeKey',
      key: 'timeKey',
    },
    {
      title: '参与人数',
      dataIndex: 'userCount',
      key: 'userCount',
    },
    {
      title: '提现成功人数',
      dataIndex: 'withdrawalSuccessUser',
      key: 'withdrawalSuccessUser',
    },
    {
      title: '提现失败人数',
      dataIndex: 'withdrawalFailUser',
      key: 'withdrawalFailUser',
    },
    {
      title: '作弊人数',
      dataIndex: 'cheatUserCount',
      key: 'cheatUserCount',
    },
    {
      title: '钱包冻结人数',
      dataIndex: 'frozenWalletUserCount',
      key: 'frozenWalletUserCount',
    },
  ];
  // 金额 用户 0 1 
  const topColumnsUserMoney = [
    {
      title: '金额',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: '用户Id',
      dataIndex: 'key',
      key: 'key',
    },
  ];
  // 次数 用户 2
  const topColumnsOnceMoney = [
    {
      title: '次数',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: '用户Id',
      dataIndex: 'key',
      key: 'key',
    },
  ];
  // 金额 ip 3 4 
  const topColumnsMoneyIp = [
    {
      title: '金额',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: 'IP',
      dataIndex: 'key',
      key: 'key',
    },
  ];

  // 次数 ip 5 
  const topColumnsOnceIp = [
    {
      title: '次数',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: 'IP',
      dataIndex: 'key',
      key: 'key',
    },
  ];

  // 用户数 ip 6
  const topColumnsUsersIp = [
    {
      title: '用户数',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: 'IP',
      dataIndex: 'key',
      key: 'key',
    },
  ];


  const drawUser = (obj: any) => {
    const { timeKey, cheatUserCount, frozenWalletUserCount, userCount, withdrawalFailUser, withdrawalSuccessUser } = obj
    const chartDom = document.getElementById('userDataContainer');
    const myChart = echarts.init(chartDom);
    let option = {
      title: {
          text: '折线图堆叠'
      },
      tooltip: {
          trigger: 'axis'
      },
      legend: {
          data: ['参与人数', '提现成功人数', '提现失败人数', '作弊人数', '钱包冻结人数']
      },
      grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
      },
      toolbox: {
          feature: {
              saveAsImage: {}
          }
      },
      xAxis: {
          type: 'category',
          boundaryGap: false,
          // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          data: timeKey
      },
      yAxis: {
          type: 'value'
      },
      series: [
          {
              name: '参与人数',
              type: 'line',
              stack: '总量',
              // data: [120, 132, 101, 134, 90, 230, 210]
              data: userCount
          },
          {
              name: '提现成功人数',
              type: 'line',
              stack: '总量',
              data: withdrawalSuccessUser
          },
          {
              name: '提现失败人数',
              type: 'line',
              stack: '总量',
              data: withdrawalFailUser
          },
          {
              name: '作弊人数',
              type: 'line',
              stack: '总量',
              data: cheatUserCount
          },
          {
              name: '钱包冻结人数',
              type: 'line',
              stack: '总量',
              data: frozenWalletUserCount
          }
      ]
    };
    myChart.setOption(option);
  }
  const drawMoney = (obj: any) => {
    const { timeKey, incomeCost, lossCost, withdrawalFailCost, withdrawalSuccessCost } = obj
    const chartDom = document.getElementById('moneyDataContainer');
    const myChart = echarts.init(chartDom);
    let option = {
      title: {
          text: '折线图堆叠'
      },
      tooltip: {
          trigger: 'axis'
      },
      legend: {
          data: ['用户收入总金额', '提现成功金额', '提现失败金额', '拦截流失资金',]
      },
      grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
      },
      toolbox: {
          feature: {
              saveAsImage: {}
          }
      },
      xAxis: {
          type: 'category',
          boundaryGap: false,
          // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          data: timeKey
      },
      yAxis: {
          type: 'value'
      },
      series: [
          {
              name: '用户收入总金额',
              type: 'line',
              stack: '总量',
              data: incomeCost
          },
          {
              name: '提现成功金额',
              type: 'line',
              stack: '总量',
              data: withdrawalSuccessCost
          },
          {
              name: '提现失败金额',
              type: 'line',
              stack: '总量',
              data: withdrawalFailCost
          },
          {
              name: '拦截流失资金',
              type: 'line',
              stack: '总量',
              data: lossCost
          }
      ]
    };
    myChart.setOption(option);
  }

  const downLoadUserData = () => {
    exportExcel(userColumns, userTableData, '用户数据-明细.xlsx')
  }

  const downLoadMoneyData = () => {
    exportExcel(moneyColumns, moneyTableData, '资金数据-明细.xlsx')
  }

  const downLoadTop10Data = (title: string, tableData: any[], col: any ) => {
    exportExcel(col, tableData, `${title}.xlsx`)
  }

  const onChangeTime = (value: any, dateString: string[]) => {
    setStartTime(dateString[0])
    setEndTime(dateString[1])
  }

  const changeTopDate = (value: any, dateString: string) => {
    setTopTime(dateString)
  }

  const onOkTime = (value: any) => {
    console.log('onOk: ', value);
  }

  const changeIntervalType = (v: string) => {
    setIntervalType(v)
  }
  
  const changeIsAll = (v: string) => {
    setIsAllValue(v)
  }

  const changeDeviceType2 = (v: string) => {
    setDeviceType2(v)
  }

  const handleSearchTopData = async () => {
    const result: any[] = []
    const obj = {
      appId: deviceType2,
      startTime: topTime,
      isAll: true,
      activeId: topActivityId,
      dataType: 0
    }
    const onlyObj = removeEmptyKeyFromObj(obj)
    for (let i = 0; i < topConfig.length; i++) {
      onlyObj.dataType = topConfig[i].ip
      const res = await getTopData(onlyObj)
      result.push(res.data.data.slice(0, 10))
    }
    // 这是整体结果
    setTopTableArr(result)
    let flag = false
    result.forEach(item => {
      if (item.length !== 0) {
        flag = true
      }
    })
    if (!flag) {
      message.warning('该段时间无数据')
    }
  }

  const resetTopSearch = () => {
    setDeviceType2('')
    setTopActivityId('')
  }

  const handleActivitySelected = (v: string) => {
    setTopActivityId(v)
  }

  const {
    cheatUserCount, frozenWalletUserCount, lossCost,
    userCount, withdrawalFailCost, withdrawalSuccessCost } = cumulative
  // console.log(topTime)
  return (
    <>
      <div className="main-content" style={{ background: 'white', paddingBottom: '20px' }}>
        <PageHeader current="资产监控" home="数据中心"/>
        <div className="spCollapseCtn">
          <Collapse defaultActiveKey={['1', '2']}>
            <Panel header="总体指标" key="1">
            <Form layout="inline" onSubmit={handleSubmit} style={{marginBottom: '10px', marginLeft: '24px'}}>
              <Form.Item label="适用端">
                  {getFieldDecorator('appId', {
                    initialValue: '',
                  })(
                    <Select style={{width: 100}}>
                      <Option value='' key='all'>全部</Option>
                      {
                        deviceType.map(item => {
                          return <Option value={item.value} key={item.id}>{item.cnValue}</Option>
                        })
                      }
                    </Select>
                  )}
                </Form.Item>
              <Form.Item label="时间间隔">
                {getFieldDecorator('intervalType', {
                    initialValue: 'day',
                  })(
                    <Select style={{width: 100}} onChange={changeIntervalType}>
                      <Option value='day' key='all'>每日</Option>
                      <Option value='hour' key='1'>每小时</Option>
                    </Select>
                  )}
              </Form.Item>
              <Form.Item label="调用时间">
                {getFieldDecorator('time', {
                    initialValue: '',
                  })(
                    <RangePicker
                      showTime={intervalType === 'day' ? false : { format: 'HH:mm' }}
                      format={intervalType === 'day' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm'}
                      placeholder={['Start Time', 'End Time']}
                      onChange={onChangeTime}
                      onOk={onOkTime}
                    />
                  )}
              </Form.Item>
              <Form.Item label="是否查看全部">
                {getFieldDecorator('isAll', {
                    initialValue: '1',
                  })(
                    <Select style={{width: 100}} onChange={changeIsAll}>
                      <Option value='1' key='1'>是</Option>
                      <Option value='2' key='2'>否</Option>
                    </Select>
                  )}
                </Form.Item>
                {
                  isAllValue === '2' && <Form.Item label="活动ID">
                    <Tooltip placement="topRight" title="活动ID对所有资金数据不生效">
                      <Icon style={{cursor: 'pointer'}} type="question-circle" />
                    </Tooltip>
                    
                    {getFieldDecorator('activeId', {
                      initialValue: '',
                    })(
                      // <Input style={{width: 140, marginLeft: '4px'}} placeholder="请输入活动id"/>
                      <SpSelect
                        value={topActivityId}
                        style={{width: '170px', marginLeft: '10px'}}
                        placeholder="请选择或输入活动Id"
                        listData={activityListData}
                        // handleActivitySelected={handleActivitySelected}
                      />
                    )}
                  </Form.Item>
                }
                <Form.Item>
                  <Button type="primary" htmlType="submit">查询</Button>
                  <Button type="primary" style={{marginLeft: '20px'}} onClick={() => {handleReSetFields()}}>重置</Button>
                </Form.Item>
              </Form>
              <ul className="showDataCtn clear marginLeft24">
                <li className="showDataItem">
                  <span className="title">累计参与人数 </span>
                  <Tooltip placement="topRight" title="活动开始后的累计参与人数">
                    <Icon type="question-circle" />
                  </Tooltip>
                  <div className="text">
                    {userCount || 0}
                  </div>
                </li>
                <li className="showDataItem">
                  <span className="title">累计作弊人数 </span>
                  <Tooltip placement="topRight" title="活动开始后风控系统拦截人数">
                    <Icon type="question-circle" />
                  </Tooltip>
                  <div className="text">
                    {cheatUserCount || 0}
                  </div>
                </li>
                <li className="showDataItem">
                  <span className="title">累计钱包冻结人数 </span>
                  <Tooltip placement="topRight" title="活动开始后风控+人工拦截人数">
                    <Icon type="question-circle" />
                  </Tooltip>
                  <div className="text">
                    {frozenWalletUserCount || 0}
                  </div>
                </li>
                <li className="showDataItem">
                  <span className="title">累计提现成功金额 </span>
                  <Tooltip placement="topRight" title="所选时间段提现成功资金总额">
                    <Icon type="question-circle" />
                  </Tooltip>
                  <div className="text">
                    {changeNumToFloag(withdrawalSuccessCost) || 0}
                  </div>
                </li>
                <li className="showDataItem">
                  <span className="title">累计提现失败资金 </span>
                  <Tooltip placement="topRight" title="所选时间段提现失败资金总额">
                    <Icon type="question-circle" />
                  </Tooltip>
                  <div className="text">
                    {changeNumToFloag(withdrawalFailCost) || 0}
                  </div>
                </li>
                {/* <li className="showDataItem">
                  <span className="title">累计拦截流失资金 </span>
                  <Tooltip placement="topRight" title="所选时间段现uid钱包所有的资金总额">
                    <Icon type="question-circle" />
                  </Tooltip>
                  <div className="text">
                    {changeNumToFloag(lossCost) || 0}
                  </div>
                </li> */}
              </ul>
              <h3 style={{textAlign: 'center', marginTop: '20px'}}>用户数据</h3>
              <div id="userDataContainer" style={{width: '100%', height: '400px'}}></div>
              <h3 style={{textAlign: 'center', marginTop: '20px'}}>
                用户数据-明细<Icon className="downLoadIcon" type="cloud-download" onClick={downLoadUserData} />
              </h3>
              <Table bordered={true} columns={userColumns} dataSource={userTableData} />
              <h3 style={{textAlign: 'center', marginTop: '20px'}}>资金数据</h3>
              <div id="moneyDataContainer" style={{width: '100%', height: '400px'}}></div>
              <h3 style={{textAlign: 'center', marginTop: '20px'}}>
                资金数据-明细<Icon className="downLoadIcon" type="cloud-download" onClick={downLoadMoneyData} />
              </h3>
              <Table bordered={true} columns={moneyColumns} dataSource={moneyTableData} />
            </Panel>
            <Panel header="Top指标" key="2">
              <div style={{paddingLeft: '24px'}}>
                <span style={{
                  color: 'rgba(0, 0, 0, 0.85)',
                  marginRight: '10px',
                  fontWeight: 'bold'
                }}>适用端:</span>
                <Select style={{width: 100}} value={deviceType2} onChange={changeDeviceType2}>
                  <Option value='' key='all'>全部</Option>
                  {
                    deviceType.map(item => {
                      return <Option value={item.value} key={item.id}>{item.cnValue}</Option>
                    })
                  }
                </Select>
                <span style={{ margin: '0 10px 0 20px', fontWeight: 'bold' }}>时间:</span>
                {/* <DatePicker onChange={changeTopDate} defaultValue={topTime} /> */}
                <DatePicker onChange={changeTopDate} />
                <span style={{ margin: '0 10px 0 20px', fontWeight: 'bold' }}>活动ID:
                <Tooltip placement="topRight" title="活动ID对所有资金数据不生效">
                  <Icon style={{cursor: 'pointer'}} type="question-circle" />
                </Tooltip>
                </span>
                <SpSelect
                  value={topActivityId}
                  style={{width: '170px'}}
                  placeholder="请选择或输入活动Id"
                  listData={activityListData}
                  handleActivitySelected={handleActivitySelected}
                />
                {/* <Input value={topActivityId} onChange={(e) => {setTopActivityId(e.target.value)}} style={{width: 140, marginLeft: '4px'}} placeholder="请输入活动id"/> */}
                
                <Button type="primary" style={{margin: '0 20px'}} onClick={handleSearchTopData}>查询</Button>
                <Button type="primary" onClick={resetTopSearch}>重置</Button>
              </div>
              <div className="topCtn">
                {
                  topConfig.map((item, i) => {
                    let useColumns: any[] = []
                    let useTableData = topTableArr[i]
                    // console.log(useTableData)
                    if (useTableData && (i === 0 || i === 1 || i === 3 || i === 4)) {
                      useTableData = useTableData.map(subItem => {
                        return {
                          key: subItem['key'] || '',
                          value: changeNumToFloag(subItem['value'])
                        }
                      })
                    }
                    if (i === 0 || i === 1) {
                      useColumns = topColumnsUserMoney
                    }
                    if (i === 2) {
                      useColumns = topColumnsOnceMoney
                    }
                    if (i === 3 || i === 4) {
                      useColumns = topColumnsMoneyIp
                    }
                    if (i === 5) {
                      useColumns = topColumnsOnceIp
                    }
                    if (i === 6) {
                      useColumns = topColumnsUsersIp
                    }
                    return <div className="subItem">
                      <h3 style={{textAlign: 'center', marginTop: '20px'}}>
                        {item.name}<Icon className="downLoadIcon" type="cloud-download" onClick={() => {downLoadTop10Data(item.name, useTableData, useColumns)}} />
                      </h3>
                      <Table bordered={true} pagination={false} columns={useColumns} dataSource={useTableData} />
                    </div>
                  })
                }
              </div>
            </Panel>
          </Collapse>
        </div>
       </div>
    </>
  );
}

// export default Form.create({ name: 'xxx' })(ActivityData);

const mapStateToProps = (state: any) => {
  return {
    deviceType: state.global.deviceType,
    activeNameList: state.global.activeNameList,
  }
}

const Wrapped = connect(mapStateToProps)(Form.create()(ActivityData));
export default Wrapped;
