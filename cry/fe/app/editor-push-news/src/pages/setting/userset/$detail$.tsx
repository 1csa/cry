import React, { useState, useEffect } from 'react' 
// import { useParams } from 'react-router-dom'
import { Formik } from 'formik'
import { Form, Input, Checkbox, Radio, Select, InputNumber } from 'formik-antd'
import { Card, Divider, Tooltip, Icon, Row, Col, Button, message } from 'antd'
import PageHeader from '@/components/PageHeader'
import LbsProfileDialog from '@/components/LbsProfileDialog'
import UserBehaviorDialog from '@/components/UserBehaviorDialog'
import SenseTasteDialog from '@/components/SenseTasteDialog'
import CtypeTasteDialog from '@/components/CtypeTasteDialog'
import InterestTagDialog from '@/components/InterestTagsDialog'
import { connect } from 'dva'
import router from 'umi/router'
import { Dispatch, ConnectState, DimensionModelState } from '@/models/connect'
import { UserSetFormProps } from '@/config/userset/userset'
import * as Validate from '@/validation/userset'
import * as UsersetService from '@/services/usersetService'

import 'antd/dist/antd.css'
import { RadioChangeEvent } from 'antd/lib/radio'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group

const compareTypeEnum = [
  { key: "EQ", value: "=" },
  { key: "GT", value: ">" },
  { key: "GE", value: ">=" },
  { key: "LT", value: "<" },
  { key: "LE", value: "<=" }
]

const formItemLayout = {
  labelCol: { sm: { span: 4 }},
  wrapperCol: { sm: { span: 20 }}
}

const tailFormItemLayout = {
  wrapperCol: { sm: { span: 20, offset: 4 }}
}

const lableIconStyle = {
  verticalAlign: 'middle',
  marginLeft: 2,
  marginTop: -2,
  color: '#1d92ff'
}

interface DimensionProps {
  dispatch: Dispatch,
  dimension: DimensionModelState
}

interface ItemTypes {
  key: string | number,
  value: string | number,
  properties?: any
}

interface DimensionArrayProps {
  key: string
  interests: Array<string> | undefined
  properties?: {
    threshold: string
  }
}

const UserSetForm: React.FC<DimensionProps> = ({ dispatch, dimension }) => {
  const { dimensionMapList } = dimension
  
  useEffect(() => {
    if (!Object.keys(dimensionMapList).length) {
      dispatch({ type: 'dimension/getDimensionListAll' })
    }
  }, [])

  // user behavior dimension map list
  const userBehaviorDimensionMapList = (): object => {
    let {
      active_days_bucket, active_doc_days_bucket, active_video_days_bucket, click_doc_bucket,
      click_video_bucket, duration_bucket, duration_doc_bucket, duration_video_bucket
    } = dimensionMapList
    return {
      active_days_bucket: active_days_bucket,
      active_doc_days_bucket: active_doc_days_bucket,
      active_video_days_bucket: active_video_days_bucket,
      click_doc_bucket: click_doc_bucket,
      click_video_bucket: click_video_bucket,
      duration_bucket: duration_bucket,
      duration_doc_bucket: duration_doc_bucket,
      duration_video_bucket: duration_video_bucket
    }
  }

  // sense taste dimension map list
  const senseTasteDimensionMapList = (): object => {
    let { hotTaste, dirtyTaste } = dimensionMapList
    return {
      hotTaste,
      dirtyTaste
    }
  }

  // ctype taste dimension map list
  const ctypeTasteDimensionMapList = (): object => {
    let { newsTaste, videoTaste, slidesTaste } = dimensionMapList
    return {
      newsTaste,
      videoTaste,
      slidesTaste
    }
  }

  // get params
  // const getParams = (): void => {
  //   let { detail } = useParams()
  //   if (detail === 'add') {
  //     initForm()
  //   } else {
  //     // TODO
  //   }
  // }

  // init form
  const initForm = (): UserSetFormProps => {
    return {
      name: '',
      aliasName: '',
      appid: [],
      appidGroup: [],
      gender: undefined,
      gender_score: 0.65,
      age: [],
      age_score: 0.5,
      persona: [],
      appCareer: [],
      lbs_user_group: [],
      lbsBlock: ' ',
      regionType: 'city',
      lbsTier: [],
      lbsProfile: [],
      distributionChannel: [],
      deviceName: [],
      osVersion: [],
      osVersion_iosCanClick: false,
      osVersion_iostype: undefined,
      osVersion_iosvalue: undefined,
      osVersion_androidCanClick: false,
      osVersion_androidtype: undefined,
      osVersion_androidvalue: undefined,
      dynamicVersion: [],
      dynamicVersion_iosCanClick: false,
      dynamicVersion_iostype: undefined,
      dynamicVersion_iosvalue: undefined,
      dynamicVersion_androidCanClick: false,
      dynamicVersion_androidtype: undefined,
      dynamicVersion_androidvalue: undefined,
      createDays: undefined,
      activationTime: undefined,
      clickDaysInPassed30Days: undefined,
      clickDaysInPassed30Days_start: undefined,
      clickDaysInPassed30Days_end: undefined,
      activeDays: undefined,
      activeDays_start: undefined,
      activeDays_end: undefined,
      userBehavior: undefined,
      sensTaste: undefined,
      ctypeTaste: undefined,
      sctCanClick: false,
      sct: [],
      sctScore: 70,
      vsctCanClick: false,
      vsct: [],
      vsctScore: 70
    }
  }

  // handle submit
  const handleSubmit = async (values: UserSetFormProps) => {
    let { aliasName, name, appid, appidGroup, gender, gender_score, age, age_score, persona, appCareer, lbs_user_group,
      lbsBlock, lbsTier, lbsProfile, distributionChannel, deviceName, osVersion_iosCanClick, osVersion_iostype,
      osVersion_iosvalue, osVersion_androidCanClick, osVersion_androidtype, osVersion_androidvalue, dynamicVersion_iosCanClick,
      dynamicVersion_iostype, dynamicVersion_iosvalue, dynamicVersion_androidCanClick, dynamicVersion_androidtype,
      dynamicVersion_androidvalue, createDays, activationTime, clickDaysInPassed30Days_end, clickDaysInPassed30Days_start,
      activeDays_start, activeDays_end, userBehavior, sensTaste, ctypeTaste, sctCanClick, sct, sctScore, vsctCanClick, vsct, vsctScore
    } = values

    // appid null and appidGroup null return
    if (!appid.length && !appidGroup.length) {
      message.error('appid appidGroup 两者必填其一')
      return
    }

    let dimensionsMap = {
      appid,
      appidGroup,
      gender: (gender ? [gender] : undefined) as string[] | undefined,
      age,
      persona,
      appCareer,
      lbs_user_group,
      lbsBlock: lbsBlock !== ' ' ? [lbsBlock] : undefined,
      lbsTier,
      lbsProfile,
      distributionChannel,
      deviceName,
      osVersion: transferOsVersion(osVersion_iosCanClick, osVersion_iostype, osVersion_iosvalue, osVersion_androidCanClick, osVersion_androidtype, osVersion_androidvalue),
      dynamicVersion: transferOsVersion(dynamicVersion_iosCanClick, dynamicVersion_iostype, dynamicVersion_iosvalue, dynamicVersion_androidCanClick, dynamicVersion_androidtype, dynamicVersion_androidvalue),
      createDays: (createDays ? [createDays] : undefined) as string[] | undefined, // : createDays
      activationTime: (activationTime ? [activationTime] : undefined) as string[] | undefined, // : activationTime
      clickDaysInPassed30Days: transferRangeTime(clickDaysInPassed30Days_start, clickDaysInPassed30Days_end, '无穷大'),
      activeDays: transferRangeTime(activeDays_start, activeDays_end, 30),
      sct: sctCanClick ? sct : null, // sct 是 array
      vsct: vsctCanClick ? vsct: null,
      ...transferData(userBehavior), // 一下三个 传 map
      ...transferData(sensTaste),
      ...transferData(ctypeTaste),
    }

    let dimensions: Array<DimensionArrayProps> = []
    Object.entries(dimensionsMap).forEach(item => {
      const [key, value] = item
      if (value && value.length) {
        dimensions.push({
          key,
          interests: value
        })
      }
    })

    // gender age sct vsct if exists then add property
    dimensions = dimensions.map((item: DimensionArrayProps) => {
      const { key, interests } = item
      if (key === 'gender') {
        item.properties = { threshold: `MEAN/GT/${gender_score}` }
      }
      if (key === 'age') {
        item.properties = { threshold: `MEAN/GT/${age_score}` }
      }
      if (key === 'sct') {
        item.properties = { threshold: `MEAN/GT/${sctScore}` }
      }
      if (key === 'vsct') {
        item.properties = { threshold: `MEAN/GT/${vsctScore}` }
      }
      return item
    })

    // post body
    let data = {
      name: name + '_newsys',
      aliasName,
      dimensions: dimensions
    }

    const { header } = await UsersetService.createUserset(data)
    if (header.code === 0) {
      message.success('保存成功!')
      router.push('/setting/userset')
    } else {
      message.error('保存失败!')
    }      
  }

  // format os version
  const transferOsVersion = (iosCanClick: boolean, iostype: string | undefined, iosvalue: string | undefined, androidCanClick: boolean, androidtype: string | undefined, androidvalue: string | undefined): Array<string> | undefined => {
    let res: Array<string> = []
    if (iosCanClick && iostype && iosvalue) {
      res.push(`IOS/${iostype}/${iosvalue}`)
    }
    if (androidCanClick && androidtype && androidvalue) {
      res.push(`Android/${androidtype}/${androidvalue}`)
    }
    return res.length ? res : undefined
  }

  // format range time
  const transferRangeTime = (start: number | undefined, end: number | undefined, max: number | string): Array<string> | undefined => {
    if (!start && !end) {
      return undefined
    }
    return [`${start || 0}-${end || max}`]
  }

  // format xx map
  const transferData = (obj: object = {}): object => {
    const keysList = Object.keys(obj)
    let res: any = {}
    keysList.forEach(item => {
      const [key, value] = item.split('&&&&')
      if (res[key]) {
        res[key].push(value)
      } else {
        res[key] = [value]
      }
    })
    return res
  }

  // change region type
  const handleChangeRegionType = (setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void, e: RadioChangeEvent ): void => {
    if (e.target.value === 'city') {
      setFieldValue('lbsProfile', [])
    } else {
      setFieldValue('lbsTier', [])
    }
  }

  return (
    <>
      <PageHeader currentMenu="圈定人群管理" currentSubMenu="新增" />
      <Card style={{ margin: '0 20px' }}>
        <div style={{ width: '800px', margin: '0 auto' }}>
          <Formik
            initialValues={ initForm() }
            onSubmit={ (values) => handleSubmit(values) }
          >
            {
              ({ values, setFieldValue, handleReset }) => (
                <Form {...formItemLayout}>
                  <FormItem name="name" label="群组名(英文)" validate={ Validate.validateName }>
                    <Input
                      name="name"
                      addonAfter="_newsys"
                      placeholder="请输入英文群组名(字母开头，仅限字母数字和下划线，如：channel_group2)"
                    />
                  </FormItem>
                  <FormItem name="aliasName" label="群组名(中文)" validate={ Validate.validateAliasName }>
                    <Input
                      name="aliasName"
                      placeholder="请输入中文群组名"
                    />
                  </FormItem>
                  <Divider>用户维度选择(appid 或 appid group必选其一)</Divider>
                  <FormItem name="appid" label={
                    <>
                      appid
                      <Tooltip title="仅展示部分常用候选，如需添加新选项，请在Tuffy用户群反馈">
                        <Icon
                          type="question-circle"
                          style={ lableIconStyle }
                        />
                      </Tooltip>
                    </>
                  }>
                    <Select
                      name="appid"
                      mode="multiple"
                      placeholder="请选择 appid"
                    >
                      {
                        dimensionMapList.appid && dimensionMapList.appid.map((item: ItemTypes) => {
                          return <Option key={ item.key }>{ item.value }</Option>
                        })
                      }
                    </Select>
                  </FormItem>
                  <FormItem name="appidGroup" label={
                    <>
                      appid group
                      <Tooltip title="请选择appid group，有问题请在Tuffy用户群反馈">
                        <Icon
                          type="question-circle"
                          style={ lableIconStyle }
                        />
                      </Tooltip>
                    </>
                  }>
                    <Select
                      name="appidGroup"
                      mode="multiple"
                      placeholder="请选择 appid group"
                    >
                      {
                        dimensionMapList.appidGroup && dimensionMapList.appidGroup.map((item: ItemTypes) => {
                          return <Option key={ item.key }>{ item.value }</Option>
                        })
                      }
                    </Select>
                  </FormItem>
                  <FormItem name="gender" label={
                    <>
                      性别
                      <Tooltip title="请选择性别，无选项时将不进行该维度的筛选">
                        <Icon
                          type="question-circle"
                          style={ lableIconStyle }
                        />
                      </Tooltip>
                    </>
                  }>
                    <>
                      <Row gutter={10}>
                        <Col span={19}>
                          <Select
                            name="gender"
                            allowClear
                            placeholder="请选择性别，无选项时默认为全部"
                          >
                            {
                              dimensionMapList.gender && dimensionMapList.gender.map((item: ItemTypes) => {
                                return <Option key={ item.key }>{ item.value }</Option>
                              })
                            }
                          </Select>
                        </Col>
                        <Col span={5}>
                          <FormItem name="gender_score" validate={ Validate.validateScore } style={{ marginBottom: 0 }}>
                            <InputNumber
                              name="gender_score"
                              style={{ width: '100%' }}
                              placeholder="最低置信度"
                              min={ -100 }
                              max={ 100 }
                              precision={ 2 }
                              step={ 0.01 }
                            />
                          </FormItem>
                        </Col>
                      </Row>
                    </>
                  </FormItem>
                  <FormItem name="age" label={
                    <>
                      年龄
                      <Tooltip title="请选择年龄，无选项时将不进行该维度的筛选">
                        <Icon
                          type="question-circle"
                          style={ lableIconStyle }
                        />
                      </Tooltip>
                    </>
                  }>
                    <>
                      <Row gutter={10}>
                        <Col span={19}>
                          <Select
                            name="age"
                            mode="multiple"
                            placeholder="请选择年龄，无选项时默认为全部"
                          >
                            {
                              dimensionMapList.age && dimensionMapList.age.map((item: ItemTypes) => {
                                return <Option key={ item.key }>{ item.value }</Option>
                              })
                            }
                          </Select>
                        </Col>
                        <Col span={5}>
                          <FormItem name="age_score" validate={ Validate.validateScore } style={{ marginBottom: 0 }}>
                            <InputNumber
                              name="age_score"
                              style={{ width: '100%' }}
                              placeholder="最低置信度"
                              min={ -100 }
                              max={ 100 }
                              precision={ 2 }
                              step={ 0.01 }
                            />
                          </FormItem>
                        </Col>
                      </Row>
                    </>  
                  </FormItem>
                  <FormItem name="persona" label={
                    <>
                      人群(点击行为)
                      <Tooltip title="支持自定义输入，但是需要确定输入的格式与画像内保存的一致，区分大小写;对应画像字段为 top_persona">
                        <Icon
                          type="question-circle"
                          style={ lableIconStyle }
                        />
                      </Tooltip>
                    </>
                  }>
                    <Select
                      name="persona"
                      mode="tags"
                      placeholder="请选择人群，无选项时默认为全部（自定义输入需谨慎）"
                    >
                      {
                        dimensionMapList.persona && dimensionMapList.persona.map((item: ItemTypes) => {
                          return <Option key={ item.key }>{ item.value }</Option>
                        })
                      }
                    </Select>
                  </FormItem>
                  <FormItem name="appCareer" label={
                    <>
                      人群(应用安装)
                      <Tooltip title="对应画像字段为 app_career">
                        <Icon
                          type="question-circle"
                          style={ lableIconStyle }
                        />
                      </Tooltip>
                    </>
                  }>
                    <Select
                      name="appCareer"
                      mode="multiple"
                      placeholder="请选择人群"
                    >
                      {
                        dimensionMapList.appCareer && dimensionMapList.appCareer.map((item: ItemTypes) => {
                          return <Option key={ item.key }>{ item.value }</Option>
                        })
                      }
                    </Select>
                  </FormItem>
                  <FormItem name="lbs_user_group" label={
                    <>
                      人群(地理位置)
                      <Tooltip title="对应画像字段为 lbs_user_group">
                        <Icon
                          type="question-circle"
                          style={ lableIconStyle }
                        />
                      </Tooltip>
                    </>
                  }>
                    <Select
                      name="lbs_user_group"
                      mode="multiple"
                      placeholder="请选择人群"
                    >
                      {
                        dimensionMapList.lbs_user_group && dimensionMapList.lbs_user_group.map((item: ItemTypes) => {
                          return <Option key={ item.key }>{ item.value }</Option>
                        })
                      }
                    </Select>
                  </FormItem>
                  {/* 所在地 */}
                  <FormItem name="lbs" label={
                    <>
                      所在地
                      <Tooltip title="可以选择敏感区域，行政区划指的是省市县区的筛选">
                        <Icon
                          type="question-circle"
                          style={ lableIconStyle }
                        />
                      </Tooltip>
                    </>
                  }>
                    <Row gutter={12}>
                      <Col span={5}>
                        <FormItem name="lbsBlock">
                          <Select
                            name="lbsBlock"
                            allowClear
                            placeholder=""
                          >
                            <Option value=" ">全部区域</Option>
                            <Option value="true">敏感区域</Option>
                            <Option value="false">非敏感区域</Option>
                          </Select>
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem name="regionType">
                          <RadioGroup name="regionType" onChange={ (e) => handleChangeRegionType(setFieldValue, e) }>
                            <Radio name="regionType" value="city">城市分级</Radio>
                            <Radio name="regionType" value="county">行政区划</Radio>
                          </RadioGroup>
                        </FormItem>
                      </Col>
                      <Col span={24}>
                        {
                          values.regionType === 'city' ? (
                            <FormItem name="lbsTier" style={{ marginBottom: 0 }}>
                              <Select
                                name="lbsTier"
                                mode="multiple"
                                placeholder="请选择"
                              >
                                {
                                  dimensionMapList.lbsTier && dimensionMapList.lbsTier.map((item: ItemTypes) => {
                                    return <Option key={ item.key }>{ item.value }</Option>
                                  })
                                }
                              </Select>
                            </FormItem>
                          ) : (
                            <FormItem name="lbsProfile" style={{ marginBottom: 0 }}>
                              <LbsProfileDialog
                                lbsProfile={ values.lbsProfile || [] }
                                setFieldValue={ setFieldValue }
                                lbsProfileDimensionMapList={ dimensionMapList.lbsProfile }
                              />
                            </FormItem>
                          )
                        }
                      </Col>
                    </Row>
                  </FormItem>
                  <FormItem name="distributionChannel" label={
                    <>
                      渠道
                      <Tooltip title="搜索并选择渠道号，只展示部分候选，自定义输入需确定入画像内保存的一致，区分大小写">
                        <Icon
                          type="question-circle"
                          style={ lableIconStyle }
                        />
                      </Tooltip>
                    </>
                  }>
                    <Select
                      name="distributionChannel"
                      mode="tags"
                      placeholder="请搜索并选择渠道，无选项时默认为全部（自定义输入需谨慎）"
                    >
                      {
                        dimensionMapList.distributionChannel && dimensionMapList.distributionChannel.map((item: ItemTypes) => {
                          return <Option key={ item.key }>{ item.value }</Option>
                        })
                      }
                    </Select>
                  </FormItem>
                  <FormItem name="deviceName" label={
                    <>
                      机型
                      <Tooltip title="搜索并选择机型，只展示部分候选，自定义输入需确定入画像内保存的一致，区分大小写">
                        <Icon
                          type="question-circle"
                          style={ lableIconStyle }
                        />
                      </Tooltip>
                    </>
                  }>
                    <Select
                      name="deviceName"
                      mode="tags"
                      placeholder="请搜索并选择机型，无选项时默认为全部（自定义输入需谨慎）"
                    >
                      {
                        dimensionMapList.deviceName && dimensionMapList.deviceName.map((item: ItemTypes) => {
                          return <Option key={ item.key }>{ item.value }</Option>
                        })
                      }
                    </Select>
                  </FormItem>
                  {/* TODO 版本号 */}
                  <FormItem name="osVersion" style={{ marginBottom: '0px' }} label={
                    <>
                      版本号
                      <Tooltip title="先勾选需要圈选的系统，再选择判断关系并输入版本号数字">
                        <Icon
                          type="question-circle"
                          style={ lableIconStyle }
                        />
                      </Tooltip>
                    </>
                  }>
                    <Row gutter={10}>
                      <Col span={4}>
                        <FormItem name="osVersion_iosCanClick">
                          <Checkbox 
                            name="osVersion_iosCanClick"
                          >IOS</Checkbox>
                        </FormItem>
                      </Col>
                      <Col span={4}>
                        <FormItem name="osVersion_iostype">
                          <Select
                            name="osVersion_iostype"
                            placeholder="判断关系"
                            disabled={ !values.osVersion_iosCanClick }
                          >
                            {
                              compareTypeEnum.map((item: any) => {
                                return <Option key={ item.key }>{ item.value }</Option>
                              })
                            }
                          </Select>
                        </FormItem>
                      </Col>
                      <Col span={16}>
                        <FormItem name="osVersion_iosvalue" validate={ Validate.validateVersion }>
                          <Input 
                            name="osVersion_iosvalue"
                            placeholder="请输入版本号数字，例如：5.1.4.2"
                            disabled={ !values.osVersion_iosCanClick }
                          />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={10}>
                      <Col span={4}>
                        <FormItem name="osVersion_androidCanClick">
                          <Checkbox 
                            name="osVersion_androidCanClick"
                          >Android</Checkbox>
                        </FormItem>
                      </Col>
                      <Col span={4}>
                        <FormItem name="osVersion_androidtype">
                          <Select
                            name="osVersion_androidtype"
                            placeholder="判断关系"
                            disabled={ !values.osVersion_androidCanClick }
                          >
                            {
                              compareTypeEnum.map((item: any) => {
                                return <Option key={ item.key }>{ item.value }</Option>
                              })
                            }
                          </Select>
                        </FormItem>
                      </Col>
                      <Col span={16}>
                        <FormItem name="osVersion_androidvalue" validate={ Validate.validateVersion }>
                          <Input 
                            name="osVersion_androidvalue"
                            placeholder="请输入版本号数字，例如：5.1.4.2"
                            disabled={ !values.osVersion_androidCanClick }
                          />
                        </FormItem>
                      </Col>
                    </Row>
                  </FormItem>
                  {/* TODO 动态版本号 */}
                  <FormItem name="dynamicVersion" style={{ marginBottom: '0px' }} label={
                    <>
                      动态版本号
                      <Tooltip title="先勾选需要圈选的系统，再选择判断关系并输入版本号数字">
                        <Icon
                          type="question-circle"
                          style={ lableIconStyle }
                        />
                      </Tooltip>
                    </>
                  }>
                    <Row gutter={10}>
                      <Col span={4}>
                        <FormItem name="dynamicVersion_iosCanClick">
                          <Checkbox 
                            name="dynamicVersion_iosCanClick"
                          >IOS</Checkbox>
                        </FormItem>
                      </Col>
                      <Col span={4}>
                        <FormItem name="dynamicVersion_iostype">
                          <Select
                            name="dynamicVersion_iostype"
                            placeholder="判断关系"
                            disabled={ !values.dynamicVersion_iosCanClick }
                          >
                            {
                              compareTypeEnum.map((item: any) => {
                                return <Option key={ item.key }>{ item.value }</Option>
                              })
                            }
                          </Select>
                        </FormItem>
                      </Col>
                      <Col span={16}>
                        <FormItem name="dynamicVersion_iosvalue" validate={ Validate.validateVersion }>
                          <Input 
                            name="dynamicVersion_iosvalue"
                            placeholder="请输入版本号数字，例如：5.1.4.2"
                            disabled={ !values.dynamicVersion_iosCanClick }
                          />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={10}>
                      <Col span={4}>
                        <FormItem name="dynamicVersion_androidCanClick">
                          <Checkbox 
                            name="dynamicVersion_androidCanClick"
                          >Android</Checkbox>
                        </FormItem>
                      </Col>
                      <Col span={4}>
                        <FormItem name="dynamicVersion_androidtype">
                          <Select
                            name="dynamicVersion_androidtype"
                            placeholder="判断关系"
                            disabled={ !values.dynamicVersion_androidCanClick }
                          >
                            {
                              compareTypeEnum.map((item: any) => {
                                return <Option key={ item.key }>{ item.value }</Option>
                              })
                            }
                          </Select>
                        </FormItem>
                      </Col>
                      <Col span={16}>
                        <FormItem name="dynamicVersion_androidvalue" validate={ Validate.validateVersion }>
                          <Input 
                            name="dynamicVersion_androidvalue"
                            placeholder="请输入版本号数字，例如：5.1.4.2"
                            disabled={ !values.dynamicVersion_androidCanClick }
                          />
                        </FormItem>
                      </Col>
                    </Row>
                  </FormItem>
                  <FormItem name="createDays" label={
                    <>
                      用户创建周期
                      <Tooltip title="支持1至30天的选择，不支持自定义输入">
                        <Icon
                          type="question-circle"
                          style={ lableIconStyle }
                        />
                      </Tooltip>
                    </>
                  }>
                    <Select
                      name="createDays"
                      allowClear
                      placeholder="请选择用户创建周期，无选项时默认为全部用户，周期时长不限制"
                    >
                      {
                        dimensionMapList.createDays && dimensionMapList.createDays.map((item: ItemTypes) => {
                          return <Option key={ item.key }>{ item.value }</Option>
                        })
                      }
                    </Select>
                  </FormItem>
                  <FormItem name="activationTime" label={
                    <>
                      用户激活周期
                      <Tooltip title="支持1至30天的选择，不支持自定义输入">
                        <Icon
                          type="question-circle"
                          style={ lableIconStyle }
                        />
                      </Tooltip>
                    </>
                  }>
                    <Select
                      name="activationTime"
                      allowClear
                      placeholder="请选择用户激活周期，无选项时默认为全部用户，周期时长不限制"
                    >
                      {
                        dimensionMapList.activationTime && dimensionMapList.activationTime.map((item: ItemTypes) => {
                          return <Option key={ item.key }>{ item.value }</Option>
                        })
                      }
                    </Select>
                  </FormItem>
                  <FormItem name="clickDaysInPassed30Days" label={
                    <>
                      30天点击数
                      <Tooltip title={
                        <div>
                          30天点击数频度划分：
                          <div>低频用户[0,20]</div>
                          <div>中低频用户[21,50]</div>
                          <div>中频用户[51,100]</div>
                          <div>中高频用户[101,200]</div>
                          <div>高频用户[201,300]</div>
                          <div>全勤用户[300,∞)</div>
                        </div>
                      }>
                        <Icon
                          type="question-circle"
                          style={ lableIconStyle }
                        />
                      </Tooltip>
                    </>
                  }>
                    <Row gutter={10}>
                      <Col span={11}>
                        <InputNumber 
                          name="clickDaysInPassed30Days_start"
                          placeholder='点击数最小值，不填默认为0'
                          min={0}
                          precision={0}
                          style={{ width: '100%' }}
                        />
                      </Col>
                      <Col span={2} style={{textAlign: 'center'}}>—</Col>
                      <Col span={11}>
                        <InputNumber
                          name="clickDaysInPassed30Days_end"
                          style={{width: '100%'}}
                          placeholder='点击数最大值，不填默认为∞'
                          min={0}
                          precision={0}
                        />
                      </Col>
                    </Row>
                  </FormItem>
                  <FormItem name="activeDays" label={
                    <>
                      月活跃天数
                      <Tooltip title="左侧为最小值，右侧为最大值，最小为0最大为30">
                        <Icon
                          type="question-circle"
                          style={ lableIconStyle }
                        />
                      </Tooltip>
                    </>
                  }>
                    <Row gutter={10}>
                      <Col span={11}>
                        <InputNumber 
                          name="activeDays_start"
                          placeholder='活跃天数最小值，不填默认为0'
                          min={0}
                          precision={0}
                          style={{ width: '100%' }}
                        />
                      </Col>
                      <Col span={2} style={{textAlign: 'center'}}>—</Col>
                      <Col span={11}>
                        <InputNumber
                          name="activeDays_end"
                          style={{width: '100%'}}
                          placeholder='活跃天数最大值，不填默认为30'
                          min={0}
                          max={30}
                          precision={0}
                        />
                      </Col>
                    </Row>
                  </FormItem>
                  {/* TODO 用户行为指标 */}
                  <FormItem name="userBehavior" label={
                    <>
                      用户行为指标
                      <Tooltip title="用户各种行为的频度选择，如“活跃天数为中低频的用户”">
                        <Icon
                          type="question-circle"
                          style={ lableIconStyle }
                        />
                      </Tooltip>
                    </>
                  }>
                    <UserBehaviorDialog
                      setFieldValue={ setFieldValue }
                      userBehaviorDimensionMapList={ userBehaviorDimensionMapList() }
                    />
                  </FormItem>
                  {/* TODO 敏感度 */}
                  <FormItem name="sensTaste" label={
                    <>
                      敏感度
                      <Tooltip title="支持选择预设值或输入自定义值，其中预设值包括重度（70-100）、轻度（30-70）、普通（0-30）、不敏感（-100-0）">
                        <Icon
                          type="question-circle"
                          style={ lableIconStyle }
                        />
                      </Tooltip>
                    </>
                  }>
                    <SenseTasteDialog
                      setFieldValue={ setFieldValue }
                      senseTasteDimensionMapList={ senseTasteDimensionMapList() }
                    />
                  </FormItem>
                  {/* TODO 内容形态偏好 */}
                  <FormItem name="ctypeTaste" label={
                    <>
                      内容形态偏好
                      <Tooltip title="筛选用户对图文或视频等的喜好程度">
                        <Icon
                          type="question-circle"
                          style={ lableIconStyle }
                        />
                      </Tooltip>
                    </>
                  }>
                    <CtypeTasteDialog
                      setFieldValue={ setFieldValue }
                      ctypeTasteDimensionMapList={ ctypeTasteDimensionMapList() }
                    />
                  </FormItem>
                  {/* TODO 兴趣标签 */}
                  <FormItem name="interest" label={
                    <>
                      兴趣标签
                      <Tooltip title="筛选用户对图文或视频下，某类标签的喜好程度">
                        <Icon
                          type="question-circle"
                          style={ lableIconStyle }
                        />
                      </Tooltip>
                    </>
                  }>
                    <Row gutter={10}>
                      <Col span={3}>
                        <FormItem name="sctCanClick">
                          <Checkbox
                            name="sctCanClick"
                          >图文</Checkbox>
                        </FormItem>
                      </Col>
                      <Col span={16}>
                        <InterestTagDialog
                          name="sct"
                          setFieldValue={ setFieldValue }
                          interestTagDimensionMapList={ dimensionMapList.sct }
                          disabled={ !values.sctCanClick }
                        />
                      </Col>
                      <Col span={5}>
                        <FormItem name="sctScore">
                          <InputNumber
                            name="sctScore"
                            disabled={ !values.sctCanClick }
                            style={{ width: '100%' }}
                            placeholder="最低置信度"
                            min={ -100 }
                            max={ 100 }
                            precision={ 0 }
                            step={ 1 }
                          />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={10}>
                      <Col span={3}>
                        <FormItem name="vsctCanClick">
                          <Checkbox
                            name="vsctCanClick"
                          >视频</Checkbox>
                        </FormItem>
                      </Col>
                      <Col span={16}>
                        <InterestTagDialog
                          name="vsct"
                          setFieldValue={ setFieldValue }
                          interestTagDimensionMapList={ dimensionMapList.vsct }
                          disabled={ !values.vsctCanClick }
                        />
                      </Col>
                      <Col span={5}>
                        <FormItem name="vsctScore">
                          <InputNumber
                            name="vsctScore"
                            disabled={ !values.vsctCanClick }
                            style={{ width: '100%' }}
                            placeholder="最低置信度"
                            min={ -100 }
                            max={ 100 }
                            precision={0}
                            step={ 1 }
                          />
                        </FormItem>
                      </Col>
                    </Row>
                  </FormItem>
                  <FormItem {...tailFormItemLayout} name="operate">
                    <Button type="primary" icon="save" htmlType="submit">保存</Button>
                    <Button type="primary" icon="rollback" style={{ marginLeft: '20px' }} onClick={ handleReset }>重置</Button>
                  </FormItem>
                </Form>
              )
            }
          </Formik>
        </div>
      </Card>
    </>
  )
}

export default connect((state: ConnectState) => {
  return { dimension: state.dimension, }
})(UserSetForm)
