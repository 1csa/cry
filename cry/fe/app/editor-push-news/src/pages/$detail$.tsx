import React, { useState, useEffect, ReactNode } from 'react'
import { useHistory } from 'react-router-dom'
import { Formik } from 'formik'
import { Form, FormikDebug } from 'formik-antd'
import { Card, Steps, Button, message, Modal, Icon, Table, Switch, Drawer, Popconfirm } from 'antd'
import PageHeader from '@/components/PageHeader'
import PushBasic from '@/components/PushBasic'
import PushLaunch from '@/components/PushLaunch'
import PushApp from '@/components/PushApp'
import { PushBasicFormProps, PushLaunchFormProps, PushAppFormProps, PushFormProps, EditorInfoProps, DuplicateCheckProps } from '@/config/pushForm/push'
import * as PushService from '@/services/pushService'

import 'antd/dist/antd.css'

const FormItem = Form.Item
const { Step } = Steps

const formItemLayout = {
  labelCol: { sm: { span: 4 } },
  wrapperCol: { sm: { span: 20 } },
}

const tailFormItemLayout = {
  wrapperCol: { sm: { span: 20, offset: 4 } },
}

const columns = [{
  title: '时间',
  dataIndex: 'create_time',
  key: 'create_time'
}, {
  title: '重复原因',
  key: 'reason',
  render: (text: any, render: any) => {
    switch (text) {
      case 'docid':
        return <span>【docid 重复】 ${render.doc_id}</span>
      case 'title':
        return <span>【标题重复】 ${render.title}</span>
      case 'summary':
        return <span>【摘要重复】 ${render.summary}</span>
      default:
        return '-'
    }
  }
}, {
  title: 'docid',
  dataIndex: 'doc_id',
  key: 'doc_id'
}, {
  title: '推送方式',
  dataIndex: 'userids',
  key: 'userids'
}, {
  title: '推送标题',
  dataIndex: 'title',
  key: 'title'
}, {
  title: '包含标签',
  dataIndex: 'include_channels',
  render: (text: any, render: any) => {
    return text.length ? text.map((item: any) => {
      return <div key={ item.channelId }>{ item.info.topicName || 'null' }({ item.channelId })</div>
    }) : '-'
  }
}, {
  title: '排除标签',
  dataIndex: 'exclude_channels',
  render: (text: any, render: any) => {
    return text.length ? text.map((item: any) => {
      return <div key={ item.channelId }>{ item.info.topicName || 'null' }({ item.channelId })</div>
    }) : '-'
  }
}, {
  title: 'push type',
  dataIndex: 'push_type',
  key: 'push_type'
}, {
  title: '操作人',
  dataIndex: 'operator',
  key: 'operator'
}]

const EditorPushForm: React.FC = () => {
  // step
  const [currentStep, setCurrentStep] = useState<number>(0)
  // editor info
  const [editorInfo, setEditorInfo] = useState<EditorInfoProps>({})
  // rstype list
  const [rstypeList, setRstypeList] = useState<Array<{ name: string, id: string }>>([])
  // tvchannel list
  const [tvChannelList, setTvChannelList] = useState<Array<{ id: string, name: string }>>([])
  const [tvChannelMap, setTvChannelMap] = useState<{[key: string]: string}>({})
  // category list
  const [categoryList, setCategoryList] = useState<Array<{[key: string]: string}>>([])
  // user layer channel list
  const [userLayerChannelList, setUserLayerChannelList] = useState<Array<{[key: string]: string}>>([])
  // sync platform list
  const [syncPlatformList, setSyncPlatformList] = useState<Array<{[key: string]: string}>>([])
  // appid list
  const [appidList, setAppidList] = useState<Array<{[key: string]: string}>>([])
  // duplicate check modal visible
  const [visible, setVisible] = useState<boolean>(false)
  // duplicate check data
  const [duplicateCheckData, setDuplicateCheckData] = useState<Array<DuplicateCheckProps>>([])
  // push submit loading
  const [isPush, setIsPush] = useState<boolean>(false)
  // push form
  const [pushForm, setPushForm] = useState<PushFormProps>({})
  // push environment is test
  const [isTest, setIsTest] = useState<boolean>(false)
  // debug drawer visible
  const [debugVisible, setDebugVisible] = useState<boolean>(false)

  const history = useHistory()

  useEffect(() => {
    async function getEditorInfo () {
      const { status, permission, channels, exclude_channels, push_key } = await PushService.getEditorInfo()
      if (status === 'active') {
        let tempEditorInfo = {
          channels,
          exclude_channels,
          permission,
          push_key,
          format_channels: formatChannelObj2Array(channels),
          format_exclude_channels: formatChannelObj2Array(exclude_channels)
        }
        setEditorInfo(tempEditorInfo)
      }
    }
    getEditorInfo()
  }, [])

  // {k: v} => [{fromId: k, name: v}]
  const formatChannelObj2Array = (obj: {[key: string]: string}): Array<{[key: string]: string}> => {
    return Object.entries(obj).map(item => {
      const [fromId, name] = item
      return {
        fromId,
        name
      }
    })
  }

  const getRstypeList = async () => {
    const { status, list } = await PushService.getRstypeList()
    if (status === 'success') {
      setRstypeList(list)
    }
  }

  const getTvChannelList = async () => {
    const { count = 0, searchResults = [] } = await PushService.getTvChannelList()
    let tvChannelList = searchResults.map((item: any) => {
      return { id: item.prdContId, name: item.name }
    })
    let tvChannelMap = {}
    searchResults.forEach((item: any) => {
      tvChannelMap[item.name] = item.prdContId
    })
    setTvChannelList(tvChannelList)
    setTvChannelMap(tvChannelMap)
  }

  const getCategoryList = async () => {
    const { status, cate } = await PushService.getCategoryList()
    if (status === 'success') {
      setCategoryList(cate)
    }
  }

  const getUserLayerChannelList = async () => {
    const { status, layer } = await PushService.getUserLayerChannelList()
    if (status === 'success') {
      setUserLayerChannelList(layer)
    }
  }

  const getSyncPlatformList = async () => {
    const { status, list } = await PushService.getSyncPlatformList()
    if (status === 'success') {
      setSyncPlatformList(list)
    }
  }

  const getAppidList = async () => {
    const { status, data: { appidEnum } } = await PushService.getAppidList()
    if (status === 'success') {
      setAppidList(appidEnum)
    }
  }

  // init push basic form
  const initPushBasicForm = (): PushBasicFormProps => {
    return {
      rstype: 'normal',
      docid: '',
      ignoreTitleLimit: false,
      title: '',
      summary: '',
      img: '',
      xiaomi_img_url: '',
      oppo_push_notification_img_url: '',
      xiaomi_priority: '0',
      oppo_pay: '0',
      // explosiveDoc: false,
      sound: '1',
      bonus: '0',

      tv_action_params: {
        tv_pre_type: '',
        tv_pre_value: '',
        tv_pre_channelid: '',
        tv_ing_type: '',
        tv_ing_value: '',
        tv_ing_channelid: '',
        tv_finish_type: '',
        tv_finish_value: '',
        tv_finish_channelid: '',
        tv_time_start: '',
        tv_time_end: ''
      },
      comic_action_params: {
        docid: '',
        isDefaultSetToCatalog: false
      },
      bottom_tab_action_params: {
        tab: '',
        from_id: ''
      },
      audio_action_params: {
        docid: '',
        albumid: '',
        trackid: '',
        orderNo: 0
      },
      rank_list_action_params: {
        type: '',
        rank_type: '',
        rank_list_id: ''
      },
      novel_action_params: {
        docid: ''
      },
      channel_card_action_params: {
        from_id: '',
        doc_id: '',
        group_from_id: 'g181',
        force_to_home: false
      },
      talk_action_params: {
        talk_id: ''
      },
      local_topic_action_params: {
        talk_id: ''
      },
      tv_station_action_params: {
        tv_type: '',
        action_type: '',
        open_value: ''
      },
      tv_jump_channel_action_params: {
        open_type: '',
        category_id: '',
        open_value: ''
      }
    }
  }

  // init push launch form
  const initPushLaunchForm = (): PushLaunchFormProps => {
    return {
      pushType: 'userid',
      retrieve_strategy: '',
      cate: '',
      expireTime: '10800',
      user_layer_channel: [],
      tags: [],
      excludeTags: [],
      delay_push: '0',
    }
  }

  // init push app form
  const initPushAppForm = (): PushAppFormProps => {
    return {
      platform: ['android', 'iPhone', 'Browser'],
      sync_platform: [],
      // mobilePhone: '',
      inVersion: '',
      exVersion: '',
      inClientVersion: '',
      exClientVersion: '',
      appid: [],
      exappid: [],
      // appGroup: '',
      ad_code: '',
      quota_code: '10000',
      quota_bizcode: 'yidianzixun'
    }
  }


  // init form
  const initForm = (): PushFormProps => {
    return {
      ...initPushBasicForm(),
      ...initPushLaunchForm(),
      ...initPushAppForm(),
      key: editorInfo.push_key || '',
      showBubble: '1',
      user: '',
      action_parameter: undefined
    }
  }

  // validate form if validate success then run save
  const validate = (values: PushFormProps): {[key: string]: string} => {
    const errors: {[key: string]: string} = {}
    const { docid, title, summary, pushType, key, delay_push, delay_push_time, retrieve_strategy, cate, tags } = values
    if (!key) {
      errors.key = 'push key 不能为空'
    }
    if (!docid) {
      errors.docid = 'docid 不能为空'
    }
    if (!title) {
      errors.title = '标题不能为空'
    }
    if (!summary) {
      errors.summary = '摘要不能为空'
    }
    if (!pushType) {
      errors.pushtype = '推送类别不能为空'
    }
    if (!cate) {
      errors.cate = '分类不能为空'
    }
    if (retrieve_strategy !== 'only_veins' && !tags) {
      errors.tags = 'tags 不能为空'
    }
    if (delay_push === '1' && !delay_push_time) {
      errors.delay_push_time = '定时发送时间不能为空'
    }
    return errors
  }

  // save
  // 1. if not touched <PushLaunch />, we should set push_key in values
  // 2. format user when pushType is userid user = userids else user = pushType
  // 3. validate all formItem
  // 4. get duplicate check
  // 5. format action_parameter
  const save = async (values: PushFormProps) => {
    // 1. set push_key into values
    // 2. format user
    values = {
      ...values,
      key: editorInfo.push_key,
      user: values.pushType === 'userid' ? values.userids! : values.pushType!
    }
    setPushForm(values)

    // 3. validate all formItem
    let errors = validate(values)
    if (Object.values(errors).length) {
      let errMsg = Object.values(errors).reduce((prev: string, cur: string) => prev += ` ${cur} `, '')
      message.error(errMsg)
      return
    }

    // 4. duplicate check if no data then push else warning
    duplicateCheck(values)
  }

  // duplicate check
  const duplicateCheck = async (values: PushFormProps) => {
    const { docid, title, summary } = values
    const { status, data } = await PushService.getDuplicateCheck(docid, title, summary)
    if (status === 'success') {
      if (!data.length) {
        // 5. format action_parameter
        values = formatActionParameter(values)
        setPushForm(values)
        pushNews(values, isTest)
      } else {
        setVisible(true)
        setDuplicateCheckData(data)
      }
    }
  }

  // format action_parameter
  const formatActionParameter = (values: PushFormProps): PushFormProps => {
    let { rstype, action_parameter, tv_action_params, comic_action_params, bottom_tab_action_params,
      audio_action_params, rank_list_action_params, novel_action_params, channel_card_action_params,
      talk_action_params, local_topic_action_params, tv_station_action_params, tv_jump_channel_action_params } = values
    switch (rstype) {
      case 'tv':
        action_parameter = tv_action_params
        break
      case 'comic':
        action_parameter = comic_action_params
        break
      case 'bottom_tab':
        action_parameter = bottom_tab_action_params
        break
      case 'audio':
        action_parameter = audio_action_params
        break
      case 'rank_list':
        action_parameter = rank_list_action_params
        break
      case 'novel':
        action_parameter = novel_action_params
        break
      case 'channel_card':
        action_parameter = channel_card_action_params
        break
      case 'talk':
        action_parameter = talk_action_params
        break
      case 'local_topic':
        action_parameter = local_topic_action_params
        break
      case 'tv_station':
        action_parameter = tv_station_action_params
        break
      case 'tv_jump_channel':
        action_parameter = tv_jump_channel_action_params
        break
      default:
        break
    }
    return values
  }

  // push news
  const pushNews = async (values: PushFormProps, isTest: boolean, isForce: boolean = false) => {
    // cate if not 本地 or 新用户推送 delete fresh_user_expire_time
    if (!['49', 'z27'].includes(values.cate!)) {
      delete values.fresh_user_expire_time
    }

    const { status, reason = '' } =  await PushService.pushNews(values, isTest, isForce)
    if (status === 'success') {
      message.success('推送成功!')
      history.push('/')
    } else if (status === 'failed') {
      message.error('推送失败! ' + reason)
    } else {
      message.error('推送超时!')
    }
  }

  // render push confirm title
  const renderPushConfirmTitle = (values: PushFormProps): ReactNode => {
    const { title, summary, pushType } = values
    const flag = /test|测试/.test(title.toLowerCase())
    return (
      <>
        <h4>确定推送文章给用户?</h4>
        <h5>标题: { values.title || '没有填写标题!' }</h5>
        <h5>摘要: { values.summary || '没有填写摘要!' }</h5>
        <h5>推送类别: { values.pushType || '没有选择推送类别!' }</h5>
        { flag && <h5 style={{ color: 'red' }}>标题中包含 test 或 测试字眼，请谨慎推送</h5> }
      </>
    )
  }

  return (
    <>
      <PageHeader currentMenu="推送列表" currentSubMenu="新增 push" />
      <Card style={{ margin: '0 20px' }}>

        <Switch
          checkedChildren="是测试环境"
          unCheckedChildren="非测试环境"
          checked={ isTest }
          onChange={ (val) => setIsTest(val) }
        />
        <Steps
          current={ currentStep }
          onChange={ (current) => setCurrentStep(current) }
        >
          <Step title="push 基本信息" description="包括文章类型、docid、标题、摘要、配图、高优、声音等" />
          <Step title="push 投放信息" description="包括推送类别、热点脉络、分类、过期时间、用户层级、tags 等" />
          <Step title="客户端配置" description="包括 platform、手机型号、api 版本相关、客户端版本相关、appids 相关等" />
        </Steps>
        <div style={{ width: '800px', margin: '40px auto' }}>
          <Formik
            initialValues={ initForm() }
            onSubmit={ (values) => save(values) }
          >
            {
              ({ values, setFieldValue }) => (
                <Form {...formItemLayout}>
                  {
                    currentStep === 0 &&
                    <>
                      <PushBasic
                        values={ values }
                        setFieldValue={ setFieldValue }
                        rstypeList={ rstypeList }
                        tvChannelList={ tvChannelList }
                        tvChannelMap={ tvChannelMap }
                        getRstypeList={ getRstypeList }
                        getTvChannelList={ getTvChannelList }
                      />
                      <FormItem name="operate0" {...tailFormItemLayout}>
                        {/* <Button type="primary" onClick={ () => save(isValid, errors, values) }>推送</Button>
                        <Button type="primary" htmlType="submit">推送 submit</Button> */}
                        <Button type="primary" icon="step-forward" onClick={ () => setCurrentStep(currentStep + 1) }>下一步</Button>
                      </FormItem>
                    </>
                  }
                  {
                    currentStep === 1 &&
                    <>
                      <PushLaunch
                        values={ values }
                        setFieldValue={ setFieldValue }
                        editorInfo={ editorInfo }
                        categoryList={ categoryList }
                        userLayerChannelList={ userLayerChannelList }
                        getCategoryList={ getCategoryList }
                        getUserLayerChannelList={ getUserLayerChannelList }
                      />
                      <FormItem name="operate1" {...tailFormItemLayout}>
                        {/* <Button type="primary" onClick={ () => save(isValid, errors, values) }>推送</Button>
                        <Button type="primary" htmlType="submit">推送 submit</Button> */}
                        <Button type="primary" icon="step-forward" onClick={ () => setCurrentStep(currentStep + 1) }>下一步</Button>
                        <Button icon="step-backward" onClick={ () => setCurrentStep(currentStep - 1) } style={{ marginLeft: '20px' }}>上一步</Button>
                      </FormItem>
                    </>
                  }
                  {
                    currentStep === 2 &&
                    <>
                      <PushApp
                        values={ values }
                        setFieldValue={ setFieldValue }
                        syncPlatformList={ syncPlatformList }
                        appidList={ appidList }
                        getSyncPlatformList={ getSyncPlatformList }
                        getAppidList={ getAppidList }
                      />
                      <FormItem name="operate2" {...tailFormItemLayout}>
                        {/* <Button type="primary" onClick={ () => save(isValid, errors, values) }>推送</Button> */}
                        <Popconfirm
                          title={ renderPushConfirmTitle(values) }
                          onConfirm={ () => save(values) }
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button type="primary" icon="notification">推送</Button>
                        </Popconfirm>
                        <Button icon="step-backward" onClick={ () => setCurrentStep(currentStep - 1) } style={{ marginLeft: '20px' }}>上一步</Button>
                      </FormItem>
                    </>
                  }
                  <Button shape="circle" icon="bug" onClick={ () => setDebugVisible(true) } style={{ position: 'fixed', bottom: '50px', right: '50px' }} />
                  <Drawer
                    title="formik debug"
                    placement="right"
                    width={ 600 }
                    closable={ false }
                    onClose={ () => setDebugVisible(false) }
                    visible={ debugVisible }
                  >
                    <FormikDebug />
                  </Drawer>
                </Form>
              )
            }
          </Formik>
        </div>
      </Card>
      <Modal
        width={ 1000 }
        title={
          <>
            <Icon type="warning" theme="twoTone" twoToneColor="#ff0000" />
            <span style={{ marginLeft: '5px', color: 'red' }}>重复推送</span>
          </>
        }
        visible={ visible }
        onCancel={ () => {
          setVisible(false)
          setDuplicateCheckData([])
        } }
        onOk={ () => pushNews(pushForm, isTest, true) }
        okText="强制推送"
        cancelText="修改推送配置"
      >
        <Table
          columns={ columns }
          dataSource={ duplicateCheckData }
        />
      </Modal>
    </>
  )
}

export default EditorPushForm
