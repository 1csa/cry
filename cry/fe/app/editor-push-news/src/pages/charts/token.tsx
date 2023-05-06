import React, { useState, useEffect, useCallback } from 'react';
import { Formik } from 'formik';
import { Form, Input, DatePicker } from 'formik-antd';
import { Card, Divider, Button, Row, Col, Drawer, message, Tooltip, Icon, Spin } from 'antd';
import { RangeValue } from 'rc-picker/lib/interface';
import PageHeader from '@/components/PageHeader';
import { TokenLineCharts } from '@/components/TokenLineCharts';
import { queryTokenHistory, queryChannelCheck } from '@/services/chartsService';
import moment, { Moment } from 'moment';
import 'antd/dist/antd.css';
import './index.less';
import { GeneralLineData, queryTokenHistoryProps, LineData, PushTypeResultProps, queryChannelProps } from '@/config/charts/token';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { sm: { span: 6 } },
  wrapperCol: { sm: { span: 12 } },
};

const lableIconStyle = {
  verticalAlign: 'middle',
  marginLeft: 2,
  marginTop: -2,
  color: '#1d92ff',
};
const { RangePicker } = DatePicker;
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];

const helperFn = (list: { channelName: string }[]) => {
  return list.map(item => item.channelName || '');
};
const handleTokenResult = (result: queryTokenHistoryProps['tokenResult']) => {
  // 设置渠道
  const arrList: string[] = helperFn(result.channelHistory);

  const map = {
    insertCount: '新增总数',
    updateCount: '更新总数',
    deleteCount: '删除总数',
  };
  const dataList: {
    [x: string]: LineData;
  } = {};
  let categoryMap = Object.keys(map);
  if (result.channelHistory) {
    result.channelHistory.map(item => {
      // dataList[item.channel]
      let arr: LineData = [];
      item.channelList.forEach(i => {
        Object.keys(i).forEach(key => {
          if (categoryMap.includes(key)) {
            arr.push({
              date: i.date,
              channel: i.channel,
              category: map[key],
              value: i[key],
            });
          }
        });
      });
      dataList[item.channel] = arr;
    });
  }
  return {
    channelList: arrList,
    chartsData: dataList,
  };
};
const handlePsuhResult = (result: queryTokenHistoryProps['pushResult']) => {
  // 设置渠道
  const arrList: string[] = helperFn(result.channelHistory);

  const map = {
    totalError: '失败数',
    totalSuccess: '成功数',
  };
  const dataList: {
    [x: string]: LineData;
  } = {};
  let categoryMap = Object.keys(map);
  if (result.channelHistory) {
    result.channelHistory.map(item => {
      // dataList[item.channel]
      let arr: LineData = [];
      item.channelList.forEach(i => {
        Object.keys(i).forEach(key => {
          if (categoryMap.includes(key)) {
            arr.push({
              date: i.date,
              channel: item.channel,
              category: map[key],
              value: Number(i[key] || 0),
            });
          }
        });
      });
      dataList[item.channel] = arr;
    });
  }
  return {
    channelList: arrList,
    chartsData: dataList,
  };
};
const handlePushTypeResult = (result: queryTokenHistoryProps['pushTypeResult']) => {
  // 设置渠道
  const map = {
    autoTotal: '全量突发',
    allBreakTotal: '局部突发',
    autoBreakTotal: '局部个性化',
  };
  let categoryMap = Object.keys(map);
  const dataList: LineData = [];
  result.pushTypeList.forEach(item => {
    // dataList[item.channel]
    Object.keys(item).forEach(key => {
      if (categoryMap.includes(key)) {
        dataList.push({
          date: item.date,
          channel: '',
          category: map[key],
          value: Number(item[key] || 0),
        });
      }
    });
  });

  return {
    chartsData: dataList,
  };
};

const handleChannelResult = (result: queryChannelProps['channels']) => {
  console.log(result);
  if (result.length) {
    // 设置渠道
    const arrList: string[] = helperFn(result);
    const map = {
      send: '发送数',
      error: '失败数',
      ok: '成功数',
      click: '点击数',
      arrive: '到达数',
    };
    return {
      channelList: arrList,
      chartsData: dataFilter(result, map),
    };
  } else {
    return {
      channelList: [],
      chartsData: {},
    };
  }
};
const dataFilter = (result: queryChannelProps['channels'], map: {}) => {
  const dataList: {
    [x: string]: LineData;
  } = {};
  let categoryMap = Object.keys(map);
  result.map((item: any) => {
    // dataList[item.channel]
    let arr: LineData = [];
    item.childList.forEach((i: { date: string; channelName: string }) => {
      Object.keys(i).forEach(key => {
        if (categoryMap.includes(key)) {
          arr.push({
            date: i.date,
            channel: i.channelName,
            category: map[key],
            value: Number(i[key] || 0),
          });
        }
      });
    });
    dataList[item.channelName] = arr;
  });
  return {
    ...dataList,
  };
};
const TokenCharts: React.FC = () => {
  // userid
  const [userid, setUserid] = useState<string>('');
  // date
  // const [date, setDate] = useState<SearchProps>([]);
  // startDate
  const [startDate, setStartDate] = useState<Moment>(moment().subtract(7, 'days'));
  // endDate
  const [endDate, setEndDate] = useState<Moment>(moment().subtract(1, 'days'));
  // token统计结果
  const [tokenResult, setTokenResult] = useState<GeneralLineData>();
  // push 成功失败统计结果
  const [pushResult, setPushResult] = useState<GeneralLineData>();
  // pushtype分类统计结果
  const [pushTypeResult, setPushTypeResult] = useState<PushTypeResultProps>();
  // 渠道推送数据统计
  const [channelsResult, setChannelsResult] = useState<GeneralLineData>();
  // 渠道版本推送统计
  const [channelAppsResult, setChannelAppsResult] = useState<GeneralLineData>();
  // loading
  const [loading, setLoading] = useState<boolean>(false);

  // const onSearch1 = async () => {
  //   if (!startDate || !endDate) {
  //     return message.warning('请输入要查询的日期');
  //   }
  //   setLoading(true);
  //   // setDate(date);
  //   const data = {
  //     startDate: startDate.format('YYYY-MM-DD'),
  //     endDate: endDate.format('YYYY-MM-DD'),
  //   };
  //   const chartsRes = await queryTokenHistory(data.startDate, data.endDate);
  //   setLoading(false);

  //   if (chartsRes.returncode === 0) {
  //     const tokenResult = handleTokenResult(chartsRes.result.tokenResult);

  //     const pushResult = handlePsuhResult(chartsRes.result.pushResult);
  //     const pushTypeResult = handlePushTypeResult(chartsRes.result.pushTypeResult);
  //     setTokenResult(tokenResult);
  //     setPushResult(pushResult);
  //     setPushTypeResult(pushTypeResult);
  //   } else {
  //     message.error(`获取点击比例数据失败!`);
  //   }
  // };

  /*
  渠道推送数据统计 & 渠道版本推送统计
  */
  const onSearch = async () => {
    if (!startDate || !endDate) {
      return message.warning('请输入要查询的日期');
    }
    setLoading(true);
    // setDate(date);
    const data = {
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
    };
    const chartsRes = await queryChannelCheck(data.startDate, data.endDate);
    setLoading(false);
    if (chartsRes.returncode === 0) {
      const channelsResult = handleChannelResult(chartsRes.result.channels);
      const channelAppsResult = handleChannelResult(chartsRes.result.channelAPPs);

      setChannelsResult(channelsResult);
      setChannelAppsResult(channelAppsResult);
    } else {
      message.error(`获取点击比例数据失败!`);
    }
  };

  const onChange = (val: RangeValue<Moment>) => {
    if (val && val[0]) {
      setStartDate(val[0]);
    }
    if (val && val[1]) {
      setEndDate(val[1]);
    }
  };
  useEffect(() => {
    onSearch();
  }, []);

  return (
    <div className="analyse">
      <PageHeader currentMenu="数据统计" currentSubMenu="数据统计" />
      <div>
        <Spin size="large" spinning={loading}>
          <Formik initialValues={{ date: [startDate, endDate] }} onSubmit={values => onSearch()}>
            <Form>
              <Row gutter={24}>
                <Col span={8}>
                  <FormItem name="date" label="日期" hasFeedback {...formItemLayout}>
                    <RangePicker
                      name="date"
                      style={{ width: '260px' }}
                      ranges={{
                        过去7天: [moment().subtract(7, 'days'), moment().subtract(1, 'days')],
                        过去30天: [moment().subtract(30, 'days'), moment().subtract(1, 'days')],
                        过去60天: [moment().subtract(60, 'days'), moment().subtract(1, 'days')],
                      }}
                      onChange={onChange}
                    />
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem name="operate">
                    <Button type="primary" htmlType="submit">
                      查询
                    </Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Formik>
        </Spin>
      </div>
      {tokenResult && <TokenLineCharts title="Token监控" lineConfig={tokenResult} />}
      {pushResult && <TokenLineCharts title="成功失败统计结果" lineConfig={pushResult} />}
      {pushTypeResult && <TokenLineCharts title="分类统计结果" lineConfig={pushTypeResult} />}
      {channelsResult && <TokenLineCharts title="渠道推送统计" lineConfig={channelsResult} />}
      {channelAppsResult && <TokenLineCharts title="渠道版本推送统计" lineConfig={channelAppsResult} />}
    </div>
  );
};

export default TokenCharts;
