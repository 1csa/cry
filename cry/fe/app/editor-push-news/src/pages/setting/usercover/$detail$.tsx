import React, { useState, useEffect, useRef } from 'react' 
// import { useParams } from 'react-router-dom'
import { Formik } from 'formik'
import { Form, Input, Checkbox, Select, InputNumber } from 'formik-antd'
import { Card, Tooltip, Icon, Row, Col, Button, message, Tabs } from 'antd'
import PageHeader from '@/components/PageHeader'
import LbsProfileDialog from '@/components/LbsProfileDialog'
import InterestTagDialog from '@/components/InterestTagsDialog'
import { connect } from 'dva'
import router from 'umi/router'
import { Dispatch, ConnectState, DimensionModelState } from '@/models/connect'
import { UserSetFormProps } from '@/config/usercover/usercover'
import * as Validate from '@/validation/userset'
import * as UsersetService from '@/services/usersetService'

import 'antd/dist/antd.css'
import "./index.less";

const FormItem = Form.Item
const Option = Select.Option
const { TabPane } = Tabs;

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
  const [loading, setLoading] = useState<Boolean>(true);
  const [tabnum, setTabnum] = useState<Number>(1);
  const [coordinate, setCoordinate] = useState<Object>({});
  const [addressName, setAddressName] = useState<string>('');

  useEffect(() => {
    if (!Object.keys(dimensionMapList).length) {
      dispatch({ type: 'dimension/getDimensionListAll' })
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if(tabnum === 2 && !loading){ // 避免map重复渲染，map必须在tab切换到展示后才能获取到dom元素
      map()
      setLoading(true)
    }
  }, [tabnum])

  const getId = (id: string) => {
    return document.getElementById(id);
  }
  // 百度地图
  const map = () => {
    var map = new window.BMap.Map("l-map");
    map.centerAndZoom("北京",12);                   // 初始化地图,设置城市和地图级别。

    var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
      {"input" : "suggestId"
      ,"location" : map
    });

    ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
      var str = "";
      var _value = e.fromitem.value;
      var value = "";
      if (e.fromitem.index > -1) {
        value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
      }    
      str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
      
      value = "";
      if (e.toitem.index > -1) {
        _value = e.toitem.value;
        value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
      }    
      str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
      setAddressName(value);
      getId("searchResultPanel").innerHTML = str;
    });

    var myValue: string;
    ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
      var _value = e.item.value;
      myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
      getId("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
      setPlace();
    });

    function setPlace(){
      map.clearOverlays();    //清除地图上所有覆盖物
      function myFun(){
        var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
        map.centerAndZoom(pp, 18);
        // console.log(pp);
        setCoordinate(pp);
        map.addOverlay(new BMap.Marker(pp));    //添加标注
      }
      var local = new BMap.LocalSearch(map, { //智能搜索
        onSearchComplete: myFun
      });
      local.search(myValue);
    }
  }
  // init form
  const initForm = (): UserSetFormProps => {
    return {
      name: '',
      aliasName: '',
      gender: undefined,
      gender_score: 0.65,
      age: [],
      age_score: 0.5,
      regionType: 'county',
      lbsProfile: [],
      sctCanClick: false,
      sct: [],
      sctScore: 70,
      vsctCanClick: false,
      vsct: [],
      vsctScore: 70,
      radius: 0,
    }
  }
  
  // 切换tab
  const changeTab = (activeKey) => {
    setTabnum(Number(activeKey));
  }

  // handle submit
  const handleSubmit = async (values: UserSetFormProps) => {
    let { aliasName, name, gender, gender_score, age, age_score, lbsProfile, sctCanClick, sct, sctScore, vsctCanClick, vsct, vsctScore, radius
    } = values

    let dimensionsMap = {
      gender: (gender ? [gender] : undefined) as string[] | undefined,
      age,
      lbsProfile,
      sct: sctCanClick ? sct : null, // sct 是 array
      vsct: vsctCanClick ? vsct: null,
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
    if(tabnum === 1) {
      const data = {
        name: name + '_push',
        aliasName,
        dimensions: dimensions
      }
      // console.log(data)
      const { header } = await UsersetService.createUserset(data)
      if (header.code === 0) {
        message.success('保存成功!')
        router.push('/setting/usercover')
      } else {
        message.error('保存失败!')
      } 
    } else {
      const data = {
        name: name + '_push',
        aliasName,
        addressName,
        lat: coordinate.lat,
        lon: coordinate.lng,
        r: Number(radius)
      }
      // console.log(data)
      const { header } = await UsersetService.createUsersetByGPS(data)
      if (header.code === 0) {
        message.success('保存成功!')
        router.push('/setting/usercover')
      } else {
        message.error('保存失败!')
      } 
    }
  }

  return (
    <div className="usercover">
      <PageHeader currentMenu="圈定人群管理" currentSubMenu="新增" />
      <Card className="usercover-content">
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
                      addonAfter="_push"
                      placeholder="请输入英文群组名(字母开头，仅限字母数字和下划线，如：channel_group2)"
                    />
                  </FormItem>
                  <FormItem name="aliasName" label="群组名(中文)" validate={ Validate.validateAliasName }>
                    <Input
                      name="aliasName"
                      placeholder="请输入中文群组名"
                    />
                  </FormItem>

                  <Tabs type="card" defaultActiveKey={tabnum} onChange={changeTab}>
                    <TabPane tab="兴趣条件精细化" key="1">
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
                          <Col span={24}>
                            <FormItem name="lbsProfile" style={{ marginBottom: 0 }}>
                              <LbsProfileDialog
                                lbsProfile={ values.lbsProfile || [] }
                                setFieldValue={ setFieldValue }
                                lbsProfileDimensionMapList={ dimensionMapList.lbsProfile }
                              />
                            </FormItem>
                          </Col>
                        </Row>
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
                    </TabPane>
                    <TabPane tab="坐标半径圈定" key="2" disabled>
                      <div id="r-result" style={{display: 'inline-block'}}>请输入：
                        <input id="suggestId" style={{border:'1px solid #d9d9d9',borderRadius:'4px',height:'30px'}}/>
                      </div>
                      <div style={{display: 'inline-block', marginLeft: '20px'}}>半径：
                        <Input
                          name="radius" 
                          style={{width:'100px'}} 
                          addonAfter="km"
                        />
                      </div>
	                    <div id="searchResultPanel" style={{border:'1px solid #C0C0C0', width:'150px',height:'auto',display:'none'}}></div>
                      <div id="l-map" style={{height:'350px',width:'500px', marginTop:'10px',marginBottom: '20px'}}></div>
                    </TabPane>
                  </Tabs>
                  
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
    </div>
  )
}

export default connect((state: ConnectState) => {
  return { dimension: state.dimension, }
})(UserSetForm)
