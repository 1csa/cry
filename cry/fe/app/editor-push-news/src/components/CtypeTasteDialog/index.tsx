import React, { useState, useEffect } from 'react'
import { Formik } from 'formik'
import { Form, Input, Select, Radio, InputNumber } from 'formik-antd'
import { Modal, Button, Tag, Row, Col } from 'antd'

import 'antd/dist/antd.css'

const TextArea = Input.TextArea
const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group

interface IProps {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  ctypeTasteDimensionMapList: object
  [propName: string]: any
}

interface CtypeTasteProps {
  preference: string
  stepType: string
  frequency: Array<string>
  start: number | undefined
  end: number | undefined
}

const ctypeTasteEnum = {
  newsTaste: '图文',
  videoTaste: '视频',
  slidesTaste: '图集'
}

const frequencyEnum = {
  high: '重度',
  light: '轻度',
  normal: '普通',
  insensitive: '不敏感'
}

const CtypeTasteDialog: React.FC<IProps> = ({ setFieldValue, ctypeTasteDimensionMapList }) => {
  // modal show
  const [visible, setVisible] = useState<boolean>(false)
  // ctype taste map
  const [ctypeTasteMap, setCtypeTasteMap] = useState<{[propName: string]: boolean}>({})
  // ctype taste list
  let [ctypeTasteList, setCtypeTasteList] = useState<Array<string>>([])

  useEffect(() => {
    updateCtypeTasteList()
  }, [ctypeTasteMap])

  // init form
  const initCtypeTaste = (): CtypeTasteProps => {
    return {
      preference: '',
      stepType: 'preset',
      frequency: [],
      start: undefined,
      end: undefined
    }
  }

  // handle ok
  const handleOk = (): void => {
    setFieldValue('ctypeTaste', ctypeTasteMap)
    setVisible(false)
  }

  // handle cancel
  const handleCancel = (): void => {
    setVisible(false)
  }

  // handle add
  const handleAdd = (values: CtypeTasteProps, resetForm: (obj: CtypeTasteProps) => void): void => {
    let { preference, stepType, frequency, start, end } = values
    // no frequency start end return
    if (!frequency.length && (start === undefined && end === undefined)) return
    // stepType === 'custom'
    if (stepType === 'custom' && start !== undefined && end !== undefined) {
      ctypeTasteMap[`${preference}&&&&${start}-${end}`] = true
    }
    // frequency not null
    if (frequency.length) {
      frequency.forEach(item => {
        ctypeTasteMap[`${preference}&&&&${item}`] = true
      })
    }

    setCtypeTasteMap({...ctypeTasteMap})
    // reset form
    resetForm(initCtypeTaste())
  }

  // handle close
  const handleClose = (item: string): void => {
    let [preference, val] = item.split(' ')
    delete ctypeTasteMap[`${preference}&&&&${val}`]
    setCtypeTasteMap({...ctypeTasteMap})
  }

  // update sense taste list
  const updateCtypeTasteList = (): void => {
    ctypeTasteList = Object.keys(ctypeTasteMap).map(item => {
      let [taste, val] = item.split('&&&&')
      taste = ctypeTasteEnum[taste]
      val = frequencyEnum[val] ? frequencyEnum[val] : val
      return `${taste} ${val}`
    })
    setCtypeTasteList([...ctypeTasteList])
  }

  return (
    <>
      <TextArea
        name="sensTaste"
        readOnly
        value={ ctypeTasteList }
        placeholder="请选择内容形态偏好"
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
          initialValues={ initCtypeTaste() }
          onSubmit={ (values) => {} }
          render={ ({ values, setFieldValue, resetForm }) => (
            <Form>
              <Row gutter={10}>
                <Col span={5}>
                  <FormItem name="preference">
                    <Select
                      name="preference"
                      showSearch
                      placeholder="请选择指标"
                      onChange={ () => setFieldValue('frequency', []) }
                    >
                      {
                        Object.entries(ctypeTasteEnum).map(item => {
                          return <Option key={ item[0] } value={ item[0] }>{ item[1]}</Option>
                        })
                      }
                    </Select>
                  </FormItem>
                </Col>
                <Col span={4}>
                  <FormItem name="stepType">
                    <RadioGroup name="stepType">
                      <Radio name="stepType" value="preset">预设</Radio>
                      <Radio name="stepType" value="custom">自定义</Radio>
                    </RadioGroup>
                  </FormItem>
                </Col>
                <Col span={12}>
                  {
                    values.stepType === 'custom' ? (
                      <Row gutter={10}>
                        <Col span={11}>
                          <FormItem name="start">
                            <InputNumber
                              name="start"
                              style={{ width: '100%' }}
                              placeholder="最小值 -100"
                              min={ -100 }
                              max={ 100 }
                              precision={ 0 }
                            />
                          </FormItem>
                        </Col>
                        <Col span={2} style={{ textAlign: 'center' }}>-</Col>
                        <Col span={11}>
                          <FormItem name="end">
                            <InputNumber
                              name="end"
                              style={{ width: '100%' }}
                              placeholder="最大值 100"
                              min={ -100 }
                              max={ 100 }
                              precision={ 0 }
                            />
                          </FormItem>
                        </Col>
                      </Row>
                    ) : (
                      <FormItem name="frequency">
                        <Select 
                          name="frequency"
                          mode="multiple"
                          showSearch
                        >
                          {
                            (ctypeTasteDimensionMapList[values.preference] || []).map((item: any) => {
                              return <Option key={ item.key } value={ item.key }>{ item.value }</Option>
                            })
                          }
                        </Select>
                      </FormItem>
                    )
                  }
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
            ctypeTasteList.map((item, index) => {
              return <Tag key={ item } closable onClose={ () => handleClose(item) }>{ item }</Tag>
            })
          }
        </div>
      </Modal>
    </>
  )
}

export default CtypeTasteDialog