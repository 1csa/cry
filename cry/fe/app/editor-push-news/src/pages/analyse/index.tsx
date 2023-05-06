import React, { useState, useEffect, useCallback } from 'react'
import { Formik } from 'formik'
import { Form, Input } from 'formik-antd'
import { Card, Divider, Button, Row, Col, Drawer, message, Tooltip, Icon, Spin } from 'antd'
import PageHeader from '@/components/PageHeader'
import UseridHistory from '@/components/UseridHistory'
import UserBasicInfo from '@/components/UserBasicInfo'
import UserProfile from '@/components/UserProfile'
import DocDetail from '@/components/DocDetail'
import UserStatistic from '@/components/UserStatistic'
import { UserBasicInfoProps, UserProfileProps, AppDocDetailProps, PushDocDetailProps, UserStatisticProps, PushStatisticProps, AppStatisticProps } from '@/config/analyse/analyse'
import { ColumnProps } from 'antd/es/table'
import * as AnalyseService from '@/services/analyseService'

import 'antd/dist/antd.css'
import "./index.less";

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { sm: { span: 6 }},
  wrapperCol: { sm: { span: 18 }},
}

const lableIconStyle = {
  verticalAlign: 'middle',
  marginLeft: 2,
  marginTop: -2,
  color: '#1d92ff'
}

interface FilterProps {
  text: string
  value: string
}

const PushAnalyse: React.FC = () => {
  // userid
  const [userid, setUserid] = useState<string>('')
  // drawer visible
  const [visible, setVisible] = useState<boolean>(false)
  // user basic info
  const [userBasicInfo, setUserBasicInfo] = useState<UserBasicInfoProps>({})
  // user profile 
  const [userProfile, setUserProfile] = useState<UserProfileProps>({})
  const [shortTermUserProfile, setShortTermUserProfile] = useState<UserProfileProps>({})
  // doc detail
  const [pushDocDetail, setPushDocDetail] = useState<Array<PushDocDetailProps>>([])
  const [appDocDetail, setAppDocDetail] = useState<Array<AppDocDetailProps>>([])
  // user statistic
  const [userStatistic, setUserStatistic] = useState<Array<UserStatisticProps>>([])
  const [pushStatistic, setPushStatistic] = useState<Array<PushStatisticProps>>([])
  const [appStatistic, setAppStatistic] = useState<Array<AppStatisticProps>>([])
  // filter
  const [pushDayFilter, setPushDayFilter] = useState<Array<FilterProps>>([])
  const [appDayFilter, setAppDayFilter] = useState<Array<FilterProps>>([])
  // loading
  const [loading, setLoading] = useState<boolean>(false)

  const pushDocDetailColumns: ColumnProps<PushDocDetailProps>[] = [{
    title: '日期',
    dataIndex: 'day',
    key: 'day',
    width: 110,
    fixed: 'left', // 可扩展和固定列在一起用会有问题 这里先注释调
    filters: pushDayFilter,
    onFilter: (value: string, record: PushDocDetailProps) => record.day.indexOf(value) === 0
  }, {
    title: 'docid',
    dataIndex: 'doc_id',
    key: 'doc_id',
    width: 110,
    fixed: 'left',
    render: (text: string, record: PushDocDetailProps) => {
      return <a href={ `https://www.yidianzixun.com/article/${text}` } target="_blank">{ text }</a>
    }
  }, {
    title: '文章画像',
    dataIndex: 'cat',
    key: 'cat',
    width: 150,
    fixed: 'left',
    render: (text: Array<string>, record: PushDocDetailProps) => {
      return text.join(', ')
    },
  }, {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
    width: 200,
    fixed: 'left',
  }, {
    title: '摘要',
    dataIndex: 'summary',
    key: 'summary',
    width: 400,
    render: (text: string, record: PushDocDetailProps) => {
      return <Tooltip placement="top" title={ text }>
        <span 
          style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}
        >{ text }</span>
      </Tooltip>
    }
  }, {
    title: '关键词',
    dataIndex: 'kws',
    key: 'kws',
    width: 400,
    render: (text: Array<string>, record: PushDocDetailProps) => {
      return <Tooltip placement="top" title={ text.join(', ') }>
        <span 
          style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}
        >{ text.join(', ') }</span>
      </Tooltip>
    }
  },  {
    title: '推送等级',
    dataIndex: 'priority',
    key: 'priority',
    width: 100
  }, {
    title: 'push_id',
    dataIndex: 'push_id',
    key: 'push_id',
    width: 130,
  }, {
    title: 'gid',
    dataIndex: 'gid',
    key: 'gid',
    width: 100
  }, {
    title: 'gid_name',
    dataIndex: 'gid_name',
    key: 'gid_name',
    width: 130
  }, {
    title: 'push_type',
    dataIndex: 'push_type',
    key: 'push_type',
    width: 130
  }, {
    title: 'push_type_name',
    dataIndex: 'push_type_name',
    key: 'push_type_name',
    width: 150
  }, {
    title: 'include_channel',
    dataIndex: 'channels_with_name',
    key: 'channels_with_name',
    width: 300,
    render: (text: Array<string>, record: PushDocDetailProps) => {
      return <Tooltip placement="top" title={ text }>
        <span 
          style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}
        >{ text }</span>
      </Tooltip>
    }
  }, {
    title: 'exclude_channel',
    dataIndex: 'exclude_channels_with_name',
    key: 'exclude_channels_with_name',
    width: 300,
    render: (text: Array<string>, record: PushDocDetailProps) => {
      return <Tooltip placement="top" title={ text }>
        <span 
          style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}
        >{ text }</span>
      </Tooltip>
    }
  }, {
    title: '打分',
    dataIndex: 'score',
    key: 'score',
    width: 100
  }, {
    title: '打分模型',
    dataIndex: 'score_model',
    key: 'score_model',
    width: 130
  }, {
    title: '召回理由',
    dataIndex: 'doc_recall_reason',
    key: 'doc_recall_reason',
    width: 130
  }, {
    title: 'push 类型',
    dataIndex: 'subject',
    key: 'subject',
    width: 130,
    filters: [{
      text: '编辑',
      value: '编辑'
    }, {
      text: '机器',
      value: '机器'
    }],
    onFilter: (value: string, record: PushDocDetailProps) => record.subject.indexOf(value) === 0
  }, {
    title: '推送时间',
    dataIndex: 'action_push_ts',
    key: 'action_push_ts',
    width: 200
  }, {
    title: '到达时间',
    dataIndex: 'action_arrival_ts',
    key: 'action_arrival_ts',
    width: 200
  }, {
    title: '点击时间',
    dataIndex: 'action_click_ts',
    key: 'action_click_ts',
    width: 200
  }, {
    title: '完成度',
    dataIndex: 'complete_rate',
    key: 'complete_rate',
    width: 100
  }]
  
  const appDocDetailColumns: ColumnProps<AppDocDetailProps>[] = [
  //   {
  //   title: '日期',
  //   dataIndex: 'day',
  //   key: 'day',
  //   width: 130,
  //   filters: appDayFilter,
  //   onFilter: (value: string, record: AppDocDetailProps) => record.day.indexOf(value) === 0
  // }, 
  {
    title: '点击时间',
    dataIndex: 'action_ts',
    key: 'action_ts',
    width: 200
  }, {
    title: 'docid',
    dataIndex: 'doc_id',
    key: 'doc_id',
    width: 130,
    render: (text: string, record: AppDocDetailProps) => {
      return <a href={ `https://www.yidianzixun.com/article/${text}` } target="_blank">{ text }</a>
    }
  }, {
    title: '文章画像',
    dataIndex: 'cat',
    key: 'cat',
    width: 200,
    render: (text: Array<string>, record: AppDocDetailProps) => {
      return text.join(', ')
    }
  }, {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
    width: 250
  }, {
    title: '摘要',
    dataIndex: 'summary',
    key: 'summary',
    width: 400,
    render: (text: string, record: PushDocDetailProps) => {
      return <Tooltip placement="top" title={ text }>
        <span 
          style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}
        >{ text }</span>
      </Tooltip>
    }
  }, {
    title: '完成度',
    dataIndex: 'complete_region',
    key: 'complete_region',
    width: 100
  }, {
    title: '是否为 push 推送',
    dataIndex: 'is_from_push',
    key: 'is_from_push',
    width: 150
  }]

  useEffect(() => {
    getDayFilter('push', 'day')
  }, [pushDocDetail])

  useEffect(() => {
    getDayFilter('app', 'day')
  }, [appDocDetail])

  // search Promise.all
  const search = async (values: { userid: string }) => {
    const { userid } = values
    if (!userid) {
      return message.warning('请输入要查询的 userid')
    }
    setLoading(true)
    setUserid(userid)
    const [
      basicInfoRes, 
      userProfileRes, 
      shortTermUserProfileRes,
      pushDocDetailRes,
      appDocDetailRes,
      userStatisticRes,
      appAndPushStatisticRes,
    ] = await Promise.all([
      AnalyseService.getUserBasicInfo(userid), 
      AnalyseService.getUserProfile(userid),
      AnalyseService.getShortTermUserProfile(userid),
      AnalyseService.getPushDocDetail(userid),
      AnalyseService.getAppDocDetail(userid),
      AnalyseService.getUserStatistic(userid),
      AnalyseService.getAppAndPushStatistic(userid),
    ])
    setLoading(false)

    if (basicInfoRes.status === 'success') {
      setUserBasicInfo(basicInfoRes.data)
    } else {
      message.error(`获取基本信息失败!`)
    }

    if (userProfileRes.status === 'success') {
      setUserProfile(userProfileRes.data)
    } else {
      message.error(`获取长期画像失败!`)
    }

    if (shortTermUserProfileRes.status === 'success') {
      setShortTermUserProfile(shortTermUserProfileRes.data)
    } else {
      message.error(`获取短期画像失败!`)
    }

    if (pushDocDetailRes.status === 'success') {
      setPushDocDetail(pushDocDetailRes.docs)
      // getDayFilter('push', 'day')
    } else {
      message.error(`获取 push 文章数据失败!`)
    }

    if (appDocDetailRes.status === 'success') {
      setAppDocDetail(appDocDetailRes.docs)
      // getDayFilter('app', 'day')
    } else {
      message.error(`获取主端文章数据失败!`)
    }

    if (userStatisticRes.status === 'success') {
      setUserStatistic(userStatisticRes.data)
    } else {
      message.error(`获取数据统计失败!`)
    }

    if (appAndPushStatisticRes.status === 'success') {
      let tempAppStatistic = appAndPushStatisticRes.data.map((item: any) => {
        return { cat: item.cat, client: item.client }
      })
      let tempPushStatistic = appAndPushStatisticRes.data.map((item: any) => {
        return { cat: item.cat, push: item.push }
      })

      setAppStatistic(tempAppStatistic)
      setPushStatistic(tempPushStatistic)
    } else {
      message.error(`获取点击比例数据失败!`)
    }
  }

  // get day filter
  const getDayFilter = (name: string, key: string): void => {
    if (name === 'push') {
      let tempArr = [...new Set(pushDocDetail.map((item: PushDocDetailProps) => item[key]))] as Array<string>
      let tempFilter = tempArr.map((item: string) => ({ text: item, value: item }))
      setPushDayFilter(tempFilter)
    } else {
      let tempArr = [...new Set(appDocDetail.map((item: AppDocDetailProps) => item[key]))] as Array<string>
      let tempFilter = tempArr.map((item: string) => ({ text: item, value: item }))
      setAppDayFilter(tempFilter)
    }
  }

  return (
    <div className="analyse">
      <PageHeader currentMenu="case 分析" currentSubMenu="case 分析" />
      <Card className="analyse-content">
        <Spin size="large" spinning={ loading }>
        <Formik
          initialValues={{ userid }}
          onSubmit={ (values) => search(values) }
        >
          {
            () => (
              <Form>
                <Row gutter={ 24 }>
                  <Col span={ 8 }>
                    <FormItem name="userid" label="userid" {...formItemLayout}>
                      <Input 
                        name="userid"
                        placeholder="请输入要查询的 userid"
                      />
                    </FormItem>
                  </Col>
                  <Col span={ 8 }>
                    <FormItem name="operate">
                      <Button type="primary" icon="search" htmlType="submit">查询</Button>
                    </FormItem>
                  </Col>
                  <Col span={ 4 } offset={ 4 }>
                    <FormItem name="operate2">
                      <Button type="danger" onClick={ () => setVisible(true) }>查看 userid</Button>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            )
          }
        </Formik>
        {
          Object.keys(userBasicInfo).length > 0 && 
          <>
            <Divider orientation="left">基本信息</Divider>
            <UserBasicInfo userBasicInfo={ userBasicInfo } />
          </>
        }
        {
          Object.keys(userProfile).length > 0 &&
          <>
            <Divider orientation="left">用户画像</Divider>
            <h1>长期画像</h1>
            <UserProfile profile={ userProfile } />
          </>
        }
        {
          Object.keys(shortTermUserProfile).length > 0 &&
          <>
            <h1>
              短期画像
              <Tooltip title="ck_s_* 表示按照点击率计算的兴趣度，cs_* 表示按照点击占比计算的兴趣度">
                <Icon
                  type="question-circle"
                  style={ lableIconStyle }
                />
              </Tooltip>
            </h1>
            <UserProfile profile={ shortTermUserProfile } />
          </>
        }
        {
          pushDocDetail.length > 0 && 
          <>
            <Divider orientation="left">push 文章数据</Divider>
            <DocDetail 
              columns={ pushDocDetailColumns }
              data={ pushDocDetail }
              showCondition={ false }
              userid={ userid }
              isExpandable={ false }
              getDocDetail={ AnalyseService.getPushDocDetail }
            />
          </>
        }
        {
          appDocDetail.length > 0 && 
          <>
            <Divider orientation="left">用户主端点击详情</Divider>
            <DocDetail 
              columns={ appDocDetailColumns }
              data={ appDocDetail }
              showCondition={ true }
              userid={ userid }
              isExpandable={ true }
              getDocDetail={ AnalyseService.getAppDocDetail }
            />
          </>
        }
        {
          (pushStatistic.length > 0 || appStatistic.length > 0 || userStatistic.length > 0) &&
          <>
            <Divider orientation="left">数据统计</Divider>
            <UserStatistic 
              pushStatistic={ pushStatistic }
              appStatistic={ appStatistic }
              statistic={ userStatistic }
              userid={ userid }
              getAppAndPushStatistic={ AnalyseService.getAppAndPushStatistic }
            />
          </>
        }
        </Spin>
      </Card>
      <Drawer
        title="抽样 userid"
        placement="right"
        width={ 600 }
        visible={ visible }
        closable={ false }
        onClose={ () => setVisible(false) }
      >
        <UseridHistory />
      </Drawer>
    </div>
  )
}

export default PushAnalyse