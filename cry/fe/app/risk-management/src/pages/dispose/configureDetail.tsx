import React, { FC, useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import { connect } from 'dva'
import { Card, Form, Switch, Input, Select, Table, message, Button, Icon, Tag, Popconfirm } from 'antd';

import { saveOrUpdate } from '@/services/risk'

import Expression from '@/components/dispose/expression'
import FormItemSwitch from '@/components/common/formItemSwitch'

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};
const formTailLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 9, offset: 3 },
};

const { Option } = Select;

import { deviceTypeSubItem, itemData } from './typing'

type locationState = {
  state: {
    flag?: string,
    record?: any
  }
}

interface featerItem {
  cnValue: string,
  id: number,
  value: string,
}
interface symbolItem {
  type: string,
  id: number,
  value: string,
}

interface symbolType {
  id: string
  left: string
  middle: string
  relation: string
  right: number | string
}

interface CurrentFormProps {
  form: { getFieldDecorator: any; validateFieldsAndScroll: any; resetFields: any};
  deviceType: deviceTypeSubItem[],
  strategyType: deviceTypeSubItem[], // 策略类型
  sceneType: deviceTypeSubItem[], // 场景类型
  errorCode: deviceTypeSubItem[], // 返回值
  featuresList: featerItem[], // 表达式的用户特征
  symbolList: symbolItem[], // 表达式的符号选择
  location: locationState,
  currentUserName: string,
}

const ConfigureDetail: FC<CurrentFormProps> = (props: CurrentFormProps) => {
  console.log(props.location.state)
  const { getFieldDecorator, validateFieldsAndScroll, resetFields } = props.form;
  const { strategyType, errorCode, deviceType, sceneType, featuresList, symbolList, currentUserName } = props 
  // const [loading, setLoading] = useState<boolean>(true);
  const [initParams, setInitParams] = useState<itemData>({
    appIds: '--',
    appNames: "",
    codeDescribe: "",
    codeExpression: "",
    codeName: "",
    createUser: "",
    errorCode: "--",
    featuresArray: [],
    id: "",
    proportion: 0,
    riskType: "--",
    sceneType: "--",
    score: 0,
    status: -1,
    updateTime: 0,
    updateUser: "",
    expressionValue: '新建数据'
  });

  const [search, setSearch] = useState<Boolean>(false);
  useEffect(() => {
    // 编辑、查看的是 保留详情
    if (props.location.state.flag === 'edit' || props.location.state.flag === 'look') {
      setInitParams(props.location.state.record)
    }
  }, [])

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    // setLoading(true);
    validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {
        let { expressionValue } = values
        let expressionValueArr = JSON.parse(expressionValue) as symbolType[]
        let flag: boolean = true
        console.log(expressionValueArr)
        expressionValueArr.forEach(item => {
          if (item.left === '' || item.middle === '' || item.right === '') {
            flag = false
          }
        })
        if (!flag) {
          message.warning('请填写完整的策略规则')
        } else {
          handleSaveOrUpdate(values)
        }
      } else {
        message.warning('请完成必填项')
      }
    });
  }

  const handleSaveOrUpdate = async (obj: itemData) => {
    const req = changeRequestData(obj)
    const res = await saveOrUpdate(req)
    if (res.data.status === 200) {
      message.success('请求成功')
      setTimeout(()=>{
        window.history.go(-1)
      }, 1500)
    } else {
      message.error(res.data.message)
    }
  }

  // 需要把请求的数据格式转换一下 bug
  const changeRequestData = (obj: itemData) => {
    let result = obj
    // 策略类型
    if (result.riskType === 'all') {
      // delete result.riskType
      result.riskType = ''
    }
    // 场景类型
    if (result.sceneType === 'all') {
      result.sceneType = ''
    }
    // 返回值
    if (result.errorCode === 'all') {
      result.errorCode = ''
    }
    // 适用端
    const { deviceType } = props
    let deviceObj = {}
    deviceType.forEach(item => {
      deviceObj[item.value] = item.cnValue
    })
    if (typeof obj.appNames !== 'string') {
      const appNames = obj.appNames as string[]
      let isSelectEdAllDevices = false
      appNames.forEach(item => {
        // 只要有一个是all 就是有全部  不传这俩参数  编辑的时候 没有这俩数据就是全部
        if (item === 'all') {
          result.appIds = ''
          result.appNames = ''
          // delete result.appIds
          // delete result.appNames
          isSelectEdAllDevices = true
        }
      });
      if (!isSelectEdAllDevices && Array.isArray(appNames)) {
        let devicesKeys: string[] = []
        let devicesValues: string[] = []
        appNames.forEach(item => {
          devicesKeys.push(item)
          devicesValues.push(deviceObj[item])
        })
        result.appIds = devicesKeys.join()
        result.appNames = devicesValues.join()
      }
    } else {
      result.appIds = props.location.state.record.appIds
      result.appNames = props.location.state.record.appNames
    }
    
    // 处理表达式
    let { expressionValue } = obj
    if (expressionValue){
      let expressionValueArr: any[] = JSON.parse(expressionValue)
      let expressionStr = ''
      let expressionArr: string[] = []
      expressionValueArr.forEach((item, index) => {
        expressionArr.push(item.left)
        if (index !== 0) {
          expressionStr += (item.relation === 'and' ? '&&' : '||' )
        }
        expressionStr += `${item.left}${item.middle}${item.right}`
      });
      result['codeExpression'] = expressionStr  
      result['featuresArray'] = expressionArr  
    }
    if (props.location.state.flag === 'edit') {
      result['upadteUser'] = currentUserName
      // result['createUser'] = currentUserName
    }
    if (props.location.state.flag === 'new') {
      result['createUser'] = currentUserName
      result['new'] = true
    } else {
      result['new'] = false
    }
    return result
  }

  const getSubTitle = ()=> {
    let result = ''
    if (props.location.state.flag === 'new') result = '新建策略'
    if (props.location.state.flag === 'edit') result = '编辑策略'
    if (props.location.state.flag === 'look') result = '查看策略'
    return result
  }
  const flag = props.location.state.flag
  return (
    <div style={{ overflowX: 'auto' }}>
      <div className="main-content" style={{minWidth: '980px'}}>
        <PageHeader current={`配置管理/${getSubTitle()}`} home="配置中心"/>
        <Card bordered={false} style={{ minHeight: 380 , marginTop: '-25px'}}>
          <Form onSubmit={handleSubmit} {...formItemLayout} style={{marginBottom: '10px'}}>
          <Form.Item label="策略ID">
            {getFieldDecorator('id', {
              initialValue: initParams.id,
              rules: [
                {
                  required: true,
                  message: '请填写',
                },
              ],
            })(
              <Input style={{width: 320}} disabled={flag === 'look'} placeholder="请输入"/>
            )}
          </Form.Item>
          <Form.Item label="策略名称">
            {getFieldDecorator('codeName', {
              initialValue: initParams.codeName,
              rules: [
                {
                  required: true,
                  message: '请填写',
                },
              ],
            })(
              <Input style={{width: 320}} disabled={flag === 'look'} placeholder="最多20个字符"/>
            )}
          </Form.Item>
          {
            initParams.riskType === '--' ?
            <Form.Item label="策略类型">
              {getFieldDecorator('riskType', {
                rules: [
                  {
                    required: true,
                    message: '请填写',
                  },
                ],
                })(
                  <Select style={{width: 150}} disabled={flag === 'look'} placeholder="请选择">
                    <Option value='all' key='all'>全部</Option>
                    {
                      strategyType.map(item => {
                        return <Option value={item.value} key={item.id}>{item.value}</Option>
                      })
                    }
                  </Select>
                )}
            </Form.Item> : 
            <Form.Item label="策略类型">
              {getFieldDecorator('riskType', {
                initialValue: initParams.riskType || 'all',
                rules: [
                  {
                    required: true,
                    message: '请填写',
                  },
                ],
                })(
                  <Select style={{width: 150}} disabled={flag === 'look'} placeholder="请选择">
                    <Option value='all' key='all'>全部</Option>
                    {
                      strategyType.map(item => {
                        return <Option value={item.value} key={item.id}>{item.value}</Option>
                      })
                    }
                  </Select>
                )}
            </Form.Item>
          }
          <Form.Item label="策略规则">
            {getFieldDecorator('expressionValue', {
                // initialValue: 'l1_ip_cnt_per_userid_1d >= 55|| l1_brandname_cnt_per_userid_1d >= 500',
                initialValue: initParams.expressionValue || '',
                rules: [
                  {
                    required: true,
                    message: '请填写',
                  },
                ],
              })(
                <Expression
                  disabled={flag === 'look'}
                  featuresList={featuresList}
                  symbolList={symbolList}
                  codeExpression={initParams.codeExpression}
                  featuresArray={initParams.featuresArray}
                />
              )}
            </Form.Item>
            <Form.Item label="策略分数">
              {getFieldDecorator('score', {
                initialValue: initParams.score || '',
                rules: [
                  {
                    required: true,
                    message: '请填写',
                  },
                ],
              })(
                <Input style={{width: 320}} disabled={flag === 'look'} placeholder="请输入"/>
              )}
            </Form.Item>
            <Form.Item label="灰度比例">
              {getFieldDecorator('proportion', {
                initialValue: initParams.proportion || '',
                rules: [
                  {
                    required: true,
                    message: '请填写',
                  },
                ],
              })(
                <Input style={{width: 320}} disabled={flag === 'look'} placeholder="请输入"/>
              )}
            </Form.Item>
            {
              initParams.errorCode === '--' ?
              <Form.Item label="返回值">
                {getFieldDecorator('errorCode', {
                    rules: [
                      {
                        required: true,
                        message: '请选择',
                      },
                    ],
                  })(
                    <Select style={{width: 150}} disabled={flag === 'look'} placeholder="请选择">
                      <Option value='all' key='all'>全部</Option>
                      {
                        errorCode.map(item => {
                          return <Option value={item.value} key={item.id}>{item.cnValue}</Option>
                        })
                      }
                    </Select>
                  )}
                </Form.Item> :
               <Form.Item label="返回值">
               {getFieldDecorator('errorCode', {
                   initialValue: initParams.errorCode || 'all',
                   rules: [
                     {
                       required: true,
                       message: '请选择',
                     },
                   ],
                 })(
                   <Select style={{width: 150}} disabled={flag === 'look'} placeholder="请选择">
                     <Option value='all' key='all'>全部</Option>
                     {
                       errorCode.map(item => {
                         return <Option value={item.value} key={item.id}>{item.cnValue}</Option>
                       })
                     }
                   </Select>
                 )}
               </Form.Item>
            }

            {
              initParams.appIds === '--' ?
              <Form.Item label="适用端">
                {getFieldDecorator('appNames', {
                  rules: [
                    {
                      required: true,
                      message: '请选择',
                    },
                  ],
                })(
                  <Select style={{width: 320}} mode="multiple" disabled={flag === 'look'} placeholder="请选择">
                    <Option value='all' key='all'>全部</Option>
                    {
                      deviceType.map(item => {
                        return <Option value={item.value} key={item.id}>{item.cnValue}</Option>
                      })
                    }
                  </Select>
                )}
              </Form.Item> :
              <Form.Item label="适用端">
                {getFieldDecorator('appNames', {
                  initialValue: initParams.appIds ? (initParams.appIds.indexOf(',') > -1 ? initParams.appIds.split(',') : initParams.appIds) : ['all'],
                  rules: [
                    {
                      required: true,
                      message: '请选择',
                    },
                  ],
                })(
                  <Select style={{width: 320}} mode="multiple" disabled={flag === 'look'} placeholder="请选择">
                    <Option value='all' key='all'>全部</Option>
                    {
                      deviceType.map(item => {
                        return <Option value={item.value} key={item.id}>{item.cnValue}</Option>
                      })
                    }
                  </Select>
                )}
              </Form.Item>
            }
            {
              initParams.sceneType === '--' ?
              <Form.Item label="场景类型">
                {getFieldDecorator('sceneType', {
                    rules: [
                      {
                        required: true,
                        message: '请选择',
                      },
                    ],
                  })(
                    <Select style={{width: 150}} disabled={flag === 'look'} placeholder="请选择">
                      <Option value='all' key='all'>全部</Option>
                      {
                        sceneType.map(item => {
                          return <Option value={item.cnValue} key={item.id}>{item.cnValue}</Option>
                        })
                      }
                    </Select>
                  )}
                </Form.Item>:
                <Form.Item label="场景类型">
                  {getFieldDecorator('sceneType', {
                      initialValue: initParams.sceneType || 'all',
                      rules: [
                        {
                          required: true,
                          message: '请选择',
                        },
                      ],
                    })(
                      <Select style={{width: 150}} disabled={flag === 'look'} placeholder="请选择">
                        <Option value='all' key='all'>全部</Option>
                        {
                          sceneType.map(item => {
                            return <Option value={item.cnValue} key={item.id}>{item.cnValue}</Option>
                          })
                        }
                      </Select>
                    )}
                  </Form.Item>
            }
            
            <Form.Item label="启用状态">
              {getFieldDecorator('status', {
                // initialValue: initParams.status === 1 ? true : false,
                initialValue: initParams.status,
                rules: [
                  {
                    required: true,
                    message: '请填写',
                  },
                ],
              })(
                // <Switch />
                <FormItemSwitch disabled={flag === 'look'} />
              )}
            </Form.Item>
            <Form.Item label="备注">
              {getFieldDecorator('codeDescribe', {
                initialValue: initParams.codeDescribe,
              })(
                <Input style={{width: 320}} disabled={flag === 'look'} placeholder="请填写" />
              )}
            </Form.Item>
            <Form.Item {...formTailLayout}>
              {
                props.location.state.flag === 'new' && <div>
                  <Button type="primary" htmlType="submit">确定</Button>
                  <Button style={{marginLeft: '20px'}} onClick={()=>{window.history.go(-1)}}>取消</Button>
                </div>
              }
              {
                props.location.state.flag === 'edit' && <div>
                  <Button type="primary" htmlType="submit">确定</Button>
                  <Button style={{marginLeft: '20px'}} onClick={()=>{window.history.go(-1)}}>取消</Button>
                </div>
              }
              {
                props.location.state.flag === 'look' && <div>
                  <Button type="primary" onClick={()=>{window.history.go(-1)}}>返回</Button>
                </div>
              }
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}
const mapStateToProps = (state: any) => {
  return {
    deviceType: state.global.deviceType,
    strategyType: state.global.strategyType,
    sceneType: state.global.sceneType,
    errorCode: state.global.errorCode,
    featuresList: state.global.featuresList,
    symbolList: state.global.symbolList,
    currentUserName: state.user.currentUser.name
  }
}

const WrappedDemo = connect(mapStateToProps)(Form.create()(ConfigureDetail));
export default WrappedDemo;
