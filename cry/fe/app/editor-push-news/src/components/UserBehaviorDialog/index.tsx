import React, { useState, useEffect } from 'react'
import { Formik } from 'formik'
import { Form, Input, Select } from 'formik-antd'
import { Modal, Button, Tag, Row, Col } from 'antd'

import 'antd/dist/antd.css'

const TextArea = Input.TextArea
const FormItem = Form.Item
const Option = Select.Option

interface IProps {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  userBehaviorDimensionMapList: object
  [propName: string]: any
}

interface UserBehaviorProps {
  behavior: string,
  frequency: string[]
}

const behaviorEnum = {
  active_days_bucket: '活跃天数等级',
  active_doc_days_bucket: '文章活跃天数等级',
  active_video_days_bucket: '视频活跃天数等级',
  click_doc_bucket: '点击文章等级',
  click_video_bucket: '点击视频等级',
  duration_bucket: '总停留时长等级',
  duration_doc_bucket: '文章停留时长等级',
  duration_video_bucket: '视频停留时长等级'
}

const UserBehaviorDialog: React.FC<IProps> = ({ setFieldValue, userBehaviorDimensionMapList }) => {
  // modal show
  const [visible, setVisible] = useState<boolean>(false)
  // user behavior map 目的是防止重复添加
  const [userBehaviorMap, setUserBehaviorMap] = useState<{[propName: string]: boolean}>({})
  // user behavior list 
  let [userBehaviorList, setUserBehaviorList] = useState<Array<string>>([])

  useEffect(() => {
    updateUserBehaviorList()
  }, [userBehaviorMap])

  // init form
  const initUserBehavior = (): UserBehaviorProps => {
    return {
      behavior: '',
      frequency: []
    }
  }

  // modal ok
  const handleOk = (): void => {
    // console.log(userBehaviorMap)
    setFieldValue('userBehavior', userBehaviorMap)
    setVisible(false)
  }

  // modal cancel
  const handleCancel = (): void => {
    setVisible(false)
  }

  // modal add
  const handleAdd = (values: UserBehaviorProps, resetForm: (obj: UserBehaviorProps) => void): void => {
    let { behavior, frequency } = values
    // not behavior or frequency return
    if (!behavior || !frequency.length) return
    frequency.forEach(item => {
      userBehaviorMap[`${behavior}&&&&${item}`] = true
    })

    setUserBehaviorMap({...userBehaviorMap})
    // reset form
    resetForm(initUserBehavior())
  }

  // tag close
  const handleClose = (item: string): void => {
    let [behavior, frequency] = item.split(' ')
    delete userBehaviorMap[`${behavior}&&&&${frequency}`]
    setUserBehaviorMap({...userBehaviorMap})
  }

  // update user behavior list
  const updateUserBehaviorList = (): void => {
    userBehaviorList = Object.keys(userBehaviorMap).map(item => {
      let [behavior, frequency] = item.split('&&&&')
      behavior = behaviorEnum[behavior]
      return `${behavior} ${frequency}`
    })
    setUserBehaviorList([...userBehaviorList])
  }

  return (
    <>
      <TextArea 
        name="userBehavior" 
        readOnly 
        value={ userBehaviorList }
        placeholder="请选择用户行为指标" 
        onClick={ () => setVisible(true) } 
      />
      <Modal
        visible={ visible }
        width={ 1000 }
        onOk={ handleOk }
        onCancel={ handleCancel }
        closable={ false }
      >
        <Formik
          initialValues={ initUserBehavior() }
          // onSubmit={ (values, actions) => handleAdd(values, actions) }
          onSubmit={ (values) => {} }
          render={ ({ values, setFieldValue, resetForm }) => (
            <Form>
              <Row gutter={5}>
                <Col span={8}>
                  <FormItem name="behavior">
                    <Select
                      name="behavior"
                      allowClear
                      placeholder="请选择指标"
                      onChange={ () => setFieldValue('frequency', [])}
                    >
                      {
                        Object.entries(behaviorEnum).map(item => {
                          return <Option key={ item[0] } value={ item[0] }>{ item[1] }</Option>
                        })
                      }
                    </Select>
                  </FormItem>
                </Col>
                <Col span={13}>
                  <FormItem name="frequency">
                    <Select
                      name="frequency"
                      mode="multiple"
                      placeholder="请选择频度"
                    >
                      {
                        (userBehaviorDimensionMapList[values.behavior] || []).map((item: any) => {
                          return <Option key={ item.key } value={ item.key }>{ item.value }</Option>
                        })
                      }
                    </Select>
                  </FormItem>
                </Col>
                <Col span={3}>
                  <Button type="primary" icon="plus" onClick={ () => handleAdd(values, resetForm) } style={{ position: 'relative', top: '4px' }}>添加</Button>
                </Col>
              </Row>
            </Form>
          )}
        />
        <h4>结果集</h4>
        <div>
          {
            userBehaviorList.map((item: string) => {
              return <Tag key={ item } closable onClose={ () => handleClose(item) } >{ item }</Tag>
            })
          }
        </div>
      </Modal>
    </>
  )
}

export default UserBehaviorDialog